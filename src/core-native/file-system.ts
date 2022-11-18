import { Injectable } from '@angular/core';
// import { Plugins, FileAppendOptions, FileAppendResult, CopyOptions, CopyResult, FileReadOptions, FileReadResult, FileWriteResult, FileWriteOptions, FileDeleteOptions, FileDeleteResult, MkdirOptions, MkdirResult, RmdirOptions, RmdirResult, ReaddirOptions, ReaddirResult, GetUriOptions, GetUriResult, StatOptions, StatResult, RenameOptions, RenameResult, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
// import 'capacitor-plugin-file-downloader';
import { FileOpener } from '@capacitor-community/file-opener';
import { saveAs } from 'file-saver';

import { DevicePlugin } from './device';
// import { resourceUsage } from 'node:process';

// import { Plugins } from '@capacitor/core';
// const { FileDownloader } = Plugins
import { Filesystem, Directory, Encoding, ReadFileOptions, ReadFileResult, AppendFileOptions, DeleteFileOptions, RmdirOptions, ReaddirOptions, GetUriOptions, StatOptions, RenameOptions, CopyOptions, ReaddirResult, GetUriResult, StatResult, CopyResult } from '@capacitor/filesystem';
import { NativeConfig } from './native-config';


export enum FileSystemPluginDirectory {
  Download = 'DOWNLOAD',
  Documents = 'DOCUMENTS',
  Cache = 'CACHE',
  Data = 'DATA',
  External = 'EXTERNAL',
  ExternalStorage = 'EXTERNAL_STORAGE'
}

enum FileSyetemElectron {
  Download = 'downloads',
  Documents = 'documents',
  Cache = 'cache',
  Data = 'userData',
  External = 'documents',
  ExternalStorage = 'documents',
}

export interface FileExistsResult { status: boolean; fileNameFullPath?: string; systemPath?: string; message?: string; error?: string }

export interface DownloadFileResult { status: boolean; fileName?: string; systemPath?: string; fullFileSystemPath?: string; message?: string; error?: string }

export interface MkdirFileResult { status: boolean; message?: string; error?: string }

export interface GenericFileResult { status: boolean; value: string; message?: string; error?: string }

const fileOpener = FileOpener;

/**
 * Wrapper para el plugin `Filesystem`.
 *
 * npm i file-saver
 * npm i @types/file-saver
 * npm i @capacitor/filesystem
 * 
 * **Capacitor**
 *
 * - Api: {@link https://capacitor.ionicframework.com/docs/apis/filesystem}
 * - Api Downloader : {@link https://github.com/veluxa/capacitor-plugin-file-downloader#english}
 *
 * ```typescript
 * import 'capacitor-plugin-file-downloader';
 * import { Plugins } from '@capacitor/core';
 * import { writeFile } from 'capacitor-blob-writer';
 * import { spawn } from 'child_process';
 * const { Filesystem, FileDownloader } = Plugins;
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class FileSystemPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public device: DevicePlugin,
    // public fileOpener: FileOpener,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  /** Read a file from disk. */
  readFile(options: ReadFileOptions): Promise<ReadFileResult> {
    return Filesystem.readFile(options);
  }

  /** Write a file to disk in the specified location on device. */
  async writeFile(options: { fileName: string; fileType?: string; path?: string; directory?: FileSystemPluginDirectory; data?: any; encoding?: Encoding; recursive?: boolean }): Promise<GenericFileResult> {
    return new Promise<GenericFileResult>((resolve: any, reject: any) => {
      try {
        this.device.getInfo().then(async value => {
          if (this.device.isRealPhone) {
            const fileSystemDirectory: Directory = this.getFileSystemDirectoryDevices(options.directory);
            // if (!options) { options = {}; }
            if (!options.recursive === undefined && !options.path) { options.recursive = true; }
            if (!options.fileName === undefined) { options.fileName = (options.fileName as string).replace('/', ''); }
            const feResults = await this.fileExists({ fileName: (options.fileName as string), path: (options.path as string), directory: options.directory });
            if (feResults.status) { const dfResults = await Filesystem.deleteFile({ path: (options.path as string) ? (options.path as string) + '/' + options.fileName : options.fileName, directory: fileSystemDirectory }); }
            Filesystem.writeFile({ path: options.path ? options.path + '/' + options.fileName : options.fileName, data: options.data, directory: fileSystemDirectory, encoding: options.encoding, recursive: options.recursive })
              .then(results => resolve({ status: true, value: results.uri })).catch(error => reject({ status: false, message: 'FileSystemPlugin.writeFileError', error }));
            // } else if (this.device.isElectron && options.fileType === 'pdf') {
            //   if (!options) { options = {}; }
            //   if (!options.recursive === undefined && !options.path) { options.recursive = true; }
            //   if (!options.fileName === undefined) { options.fileName = (options.fileName as string).replace('/', ''); }

            //   const fileSystemDirectory: string = this.device.electronService.remote.app.getPath(this.getFileSystemDirectoryDesktop(options.directory));
            //   const fileSystemEle = this.device.electronService.remote.require('fs');
            //   const barra = this.device.electronService.isMacOS ? '/' : '\\';
            //   const fullPath = fileSystemDirectory + (options.path ? barra + options.path : '') + barra + options.fileName;
            //   const feResults = await this.fileExists({ fileName: options.fileName, path: options.path, directory: options.directory });
            //   fileSystemEle.writeFile(fullPath, options.data, 'base64', (error: any, info: any) => {
            //     if (error) {
            //       reject({ status: false, message: 'FileSystemPlugin.writeFileError', error });
            //     }
            //     resolve({ status: true, value: fullPath });
            //   });
          } else {
            if (options?.data) {
              const fileType = options.fileType || 'pdf';
              const fileName = options.fileName || 'Document.' + fileType;
              const contentType = this.getMimeType(fileType);
              const blob = this.base64toBlob(options.data, contentType);
              saveAs(blob, fileName); // FileSaver.js
              resolve({ status: true, value: fileName });

            } else {
              reject({ status: false, message: 'FileSystemPlugin.errorWhitoutData' });
            }
          }
        }).catch(error => reject({ status: false, message: 'FileSystemPlugin.writeFileError', error }));
      } catch (error) {
        reject({ status: false, message: 'FileSystemPlugin.writeFileError', error });
      }
    });
  }

  /** Append to a file on disk in the specified location on device. */
  appendFile(options: AppendFileOptions): Promise<void> {
    return Filesystem.appendFile(options);
  }

  /** Delete a file from disk. */
  // deleteFile(options: DeleteFileOptions): Promise<void> {
  //   return Filesystem.deleteFile(options);
  // }
  async deleteFile(options: { fileName: string; path?: string; directory?: FileSystemPluginDirectory; }): Promise<GenericFileResult> {
    return new Promise<GenericFileResult>((resolve: any, reject: any) => {
      try {
        this.device.getInfo().then(async value => {
          if (this.device.isRealPhone) {
            const fileSystemDirectory: Directory = this.getFileSystemDirectoryDevices(options.directory);
            // if (!options) { options = {}; }
            if (!options.fileName === undefined) { options.fileName = (options.fileName as string).replace('/', ''); }
            const feResults = await this.fileExists({ fileName: (options.fileName as string), path: (options.path as string), directory: options.directory });
            if (feResults.status) { 
              Filesystem.deleteFile({ path: (options.path as string) ? (options.path as string) + '/' + options.fileName : options.fileName, directory: fileSystemDirectory })
                .then(() => resolve({ status: true }))
                .catch(() => resolve({ status: false, message: 'FileSystemPlugin.isfileExitstNotFound', fullFileSystemPath: (options.path as string) ? (options.path as string) + '/' + options.fileName : options.fileName, systemPath: fileSystemDirectory  })); 
            } else {
              resolve(feResults)
            }
          } else {
            // if (options?.data) {
            //   const fileType = options.fileType || 'pdf';
            //   const fileName = options.fileName || 'Document.' + fileType;
            //   const contentType = this.getMimeType(fileType);
            //   const blob = this.base64toBlob(options.data, contentType);
            //   saveAs(blob, fileName); // FileSaver.js
            //   resolve({ status: true, value: fileName });

            // } else {
            //   reject({ status: false, message: 'FileSystemPlugin.errorWhitoutData' });
            // }
          }
        }).catch(error => reject({ status: false, message: 'FileSystemPlugin.writeFileError', error }));
      } catch (error) {
        reject({ status: false, message: 'FileSystemPlugin.writeFileError', error });
      }
    });
  }

  /**
   * Create a directory.
   *
   * @path : string - The path of the new directory
   * @directory : FileSystemPluginDirectory - System directory of device. to make the new directory in
   * @recursive ?: boolean; - Whether to create any missing parent directories as well. Defaults to false
   */
  async mkdir(options: { path: string; directory: FileSystemPluginDirectory; recursive?: boolean }): Promise<MkdirFileResult> {
    return new Promise<MkdirFileResult>((resolve: any, reject: any) => {
      try {
        this.device.getInfo().then(value => {
          if (this.device.isRealPhone) {
            const fileSystemDirectory: Directory = this.getFileSystemDirectoryDevices(options.directory);
            Filesystem.mkdir({ path: options.path, directory: fileSystemDirectory, recursive: options.recursive }).then(() => resolve({ status: true })).catch(error => resolve({ status: false, message: 'FileSystemPlugin.mkdirFileError', error }));
            // } else if (this.device.isElectron) {
            //   const fileSystemEle = this.device.electronService.remote.require('fs');
            //   this.fileExists({ path: options.path, directory: options.directory }).then(result => {
            //     if (!result.status) {
            //       const fileSystemDirectory: string = this.device.electronService.remote.app.getPath(this.getFileSystemDirectoryDesktop(options.directory));
            //       const barra = this.device.electronService.isMacOS ? '/' : '\\';
            //       const fullPath = fileSystemDirectory + (options.path ? barra + options.path : '');
            //       fileSystemEle.mkdirSync(fullPath, options.recursive);
            //     }
            //     resolve({ status: true });
            //   });
          } else {
            resolve({ status: false, message: 'FileSystemPlugin.mkdirFileError' });
          }
        }).catch(error => resolve({ status: false, message: 'FileSystemPlugin.mkdirFileError', error }));
      } catch (error) {
        resolve({ status: false, message: 'FileSystemPlugin.mkdirFileError', error });
      }
    });
  }

  /** Remove a directory. */
  async rmdir(options: RmdirOptions): Promise<void> {
    return await Filesystem.rmdir(options);
  }

  /** Return a list of files from the directory (not recursive). */
  readdir(options: ReaddirOptions): Promise<ReaddirResult> {
    return Filesystem.readdir(options);
  }

  /** Return full File URI for a path and directory. */
  getUri(options: GetUriOptions): Promise<GetUriResult> {
    return Filesystem.getUri(options);
  }

  /** Return data about a file. */
  stat(options: StatOptions): Promise<StatResult> {
    return Filesystem.stat(options);
  }

  /** Rename a file or directory. */
  rename(options: RenameOptions): Promise<void> {
    return Filesystem.rename(options);
  }

  /** Copy a file or directory. */
  copy(options: CopyOptions): Promise<CopyResult> {
    return Filesystem.copy(options);
  }

  /**
   * Open File.
   *
   * @fileName - Filename of file example: 'image-downloaded.jpg'
   * @fileType - If you are wondering what MIME-type should you pass as the second argument to open function, Example 'application/pdf' para documento PDF, here is a list of all known MIME-types: 'http://svn.apache.org/viewvc/httpd/httpd/trunk/docs/conf/mime.types?view=co'
   * @path - Path to destination example: 'images/internet' 'images' where is folder and 'internet' is subfolder.
   * @directory - System directory of device.
   * @showDialog - Opens with system modal to open file with an already installed app.
   * Return GenericFileResult type;
   */
  openfile(options: { fileName?: string; fileType?: string; path?: string; directory?: FileSystemPluginDirectory; fullPath?: string; showDialog?: boolean }): Promise<GenericFileResult> {
    return new Promise<GenericFileResult>((resolve: any, reject: any) => {
      try {
        this.device.getInfo().then(value => {
          if (this.device.isRealPhone) {
            if (!options.fileName === undefined) { options.fileName = (options.fileName as string).replace('/', ''); }
            if (this.debug) { console.log('options fileExists => ', JSON.stringify(options)); }
            this.fileExists({ fileName: (options.fileName as string), path: (options.path as string), directory: options.directory }).then(results => {
              if (this.debug) { console.log('results fileExists => ', JSON.stringify(results)); }
              const filePath = results.fileNameFullPath || '';
              const fileType = options.fileType || '';
              fileOpener.open({filePath, contentType: this.getMimeType(fileType)})
                .then(() => resolve({ status: true, value: results.fileNameFullPath }))
                .catch(e => reject({ status: false, message: 'FileSystemPlugin.openfileFileError' }));
            });
            // } else if (this.device.isElectron) {
            //   if (options.fileType === 'pdf') {
            //     const fileSystemDirectory: string = this.device.electronService.remote.app.getPath(this.getFileSystemDirectoryDesktop(options.directory));
            //     const barra = this.device.electronService.isMacOS ? '/' : '\\';
            //     const fullPath = 'file://' + fileSystemDirectory + (options.path ? barra + options.path : '') + barra + options.fileName;
            //     if (this.debug) { console.log('openfile => ', fullPath); }
            //     const fileSystemCP = new this.device.electronService.remote.BrowserWindow({
            //       parent: this.device.electronService.remote.getCurrentWindow(),
            //       modal: false,
            //       height: 800,
            //       width: 600,
            //      });
            //     fileSystemCP.loadURL(fullPath);
            //   } else {
            //     // DO NOTHING
            //   }
          }
        }).catch(error => reject({ status: false, message: 'FileSystemPlugin.openfileFileError', error }));
      } catch (error) {
        reject({ status: false, message: 'FileSystemPlugin.openfileFileError', error });
      }
    });
  }


  /**
   * Download File a file or directory.
   *
   * @url - Url of file exaple: 'http://www.domain.com/files/image.jpg'
   * @fileName - Filename of file example: 'image-downloaded.jpg'
   * @path - Path to destination example: 'images/internet' 'images' where is folder and 'internet' is subfolder.
   * @directory - System directory of device.
   * Return DownloadFileResult type;
   */
  downloadFile(options: { url: string; fileName: string; path: string; directory: FileSystemPluginDirectory }): Promise<DownloadFileResult> {
    return new Promise<DownloadFileResult>((resolve: any, reject: any) => {
      try {
        this.device.getInfo().then(value => {
          if (this.device.isRealPhone) {
            const fileSystemDirectory: Directory = this.getFileSystemDirectoryDevices(options.directory);
            const to: string = options.path ? options.path + '/' + options.fileName : options.fileName;
            this.fileExists(options).then(async result => {
              if (result.status) { await Filesystem.deleteFile({ path: to, directory: fileSystemDirectory }); }
              // FileDownloader.download({ url: options.url, filename: options.fileName }).then(doc => {
              //   this.copy({
              //     from: options.fileName,
              //     to,
              //     directory: this.getFileSystemDirectoryDevices(FileSystemPluginDirectory.Download),
              //     toDirectory: fileSystemDirectory
              //   }).then();
              // }).catch(error => {
              //   reject({ status: false, message: 'FileSystemPlugin.downloadFileError.errorDownload', error });
              // });
            });
            // } else if (this.device.isElectron) {
            //   const fileSystemDirectory: string = this.device.electronService.remote.app.getPath(this.getFileSystemDirectoryDesktop(options.directory));
            //   const DownloadManager = this.device.electronService.remote.require('electron-download-manager');
            //   this.mkdir({ path: options.path, directory: options.directory, recursive: true }).then(() => {
            //     DownloadManager.download({
            //       url: options.url
            //     }, (error: any, info: any) => {
            //       if (error) {
            //         reject({ status: false, message: 'FileSystemPlugin.downloadFileError.errorDownload', error });
            //       }
            //       const barra = this.device.electronService.isMacOS ? '/' : '\\';
            //       const fileSystemDownloads = info.filePath;
            //       const fullPath = fileSystemDirectory + barra + (options.path ? options.path + barra + options.fileName : options.fileName);
            //       const fileSystemEle = this.device.electronService.remote.require('fs');
            //       if (fileSystemDownloads !== fullPath) { fileSystemEle.renameSync(fileSystemDownloads, fullPath); }
            //       resolve({ status: true, fullFileSystemPath: fullPath });
            //     });
            //   });
          }

        }).catch(error => reject({ status: false, message: 'FileSystemPlugin.downloadFileError', error }));
      } catch (error) {
        reject({ status: false, message: 'FileSystemPlugin.downloadFileError', error });
      }
    });
  }

  /**
   * Check if file exist on directorSystem and path.
   * Params:
   *
   * @fileName — Filename with extension.
   * @path - Especific path on system direcotry
   * @directory - direcotry of system type FilesystemDirectory
   * Return isfileExistResult type;
   */
  async fileExists(options: { fileName: string; path: string; directory?: FileSystemPluginDirectory}): Promise<FileExistsResult> {
    return new Promise<FileExistsResult>((resolve: any, reject: any) => {
      try {
        this.device.getInfo().then(value => {
          if (this.device.isRealPhone) {
            const fileSystemDirectory: Directory = this.getFileSystemDirectoryDevices(options.directory);
            if (this.debug) { console.log('FileSystemPlugin fileExists arguments =>', { path: options.path, directory: fileSystemDirectory }); }
            Filesystem.readdir({ path: (options.path as string), directory: fileSystemDirectory }).then(result => {
              if (result && result.files && options.fileName) {
                const found = result.files.find(element => element.name === options.fileName);
                if (found) {
                  Filesystem.getUri({ path: (options.path as string), directory: fileSystemDirectory }).then((resutsUri: GetUriResult) => resolve({ status: true, fileNameFullPath: resutsUri.uri + '/' + options.fileName, systemPath: resutsUri.uri })).catch(error => resolve({ status: false, message: 'FileSystemPlugin.isfileExistError => getUri', error }));
                } else {
                  resolve({ status: false, message: 'FileSystemPlugin.isfileExistNotFound', fileNameFullPath: options.fileName, systemPath: fileSystemDirectory });
                }
              } else if (result && !options.fileName) {
                Filesystem.getUri({ path: (options.path as string), directory: fileSystemDirectory }).then((resutsUri: GetUriResult) => resolve(({ status: true, systemPath: resutsUri.uri }))).catch(error => resolve({ status: false, message: 'FileSystemPlugin.isfileExistError => getUri', error }));
              } else {
                resolve({ status: false, message: 'FileSystemPlugin.isfileExistNotFound' });
              }
            }).catch(error => resolve({ status: false, message: 'FileSystemPlugin.isfileExistError => readdir =>', error }));
            // } else if (this.device.isElectron) {
            //   const barra = this.device.electronService.isMacOS ? '/' : '\\';
            //   const fileSystemDirectory: string = this.device.electronService.remote.app.getPath(this.getFileSystemDirectoryDesktop(options.directory));
            //   const fullPath = fileSystemDirectory + (options.path ? barra + options.path : '') + (options.fileName ? barra + options.fileName : '');
            //   const fileSystemEle = this.device.electronService.remote.require('fs');
            //   const existsSync = fileSystemEle.existsSync(fullPath);
            //   if (existsSync) {
            //     resolve({ status: true, fileNameFullPath: fullPath, systemPath: fileSystemDirectory });
            //   } else {
            //     resolve({ status: false, message: 'FileSystemPlugin.isfileExistNotFound' });
            //   }
          } else {
            resolve({ status: false, message: 'FileSystemPlugin.isfileExistNotFound' });
          }

        }).catch(error => resolve({ status: false, message: 'FileSystemPlugin.isfileExistError', error }));
      } catch (error) {
        resolve({ status: false, message: 'FileSystemPlugin.isfileExistError', error });
      }
    });

  }

  getFileSystemDirectoryDevices(directory: FileSystemPluginDirectory | undefined): Directory {

    switch (directory) {
      case FileSystemPluginDirectory.Download:
        if (this.device.isRealPhone && this.device.isAndroid) {
          return Directory.External;
        } else if (this.device.isRealPhone && this.device.isIos) {
          return Directory.Documents;
        }
        break;
      case FileSystemPluginDirectory.Documents:
        return Directory.Documents;
        break;
      case FileSystemPluginDirectory.Data:
        return Directory.Data;
        break;
      case FileSystemPluginDirectory.Cache:
        return Directory.Cache;
        break;
      case FileSystemPluginDirectory.External:
        return Directory.External;
        break;
      case FileSystemPluginDirectory.ExternalStorage:
        return Directory.ExternalStorage;
        break;
    }
    return Directory.Documents;
  }
  getFileSystemDirectoryDesktop(directory: FileSystemPluginDirectory): FileSyetemElectron {

    switch (directory) {
      case FileSystemPluginDirectory.Download:
        return FileSyetemElectron.Download;
        break;
      case FileSystemPluginDirectory.Documents:
        return FileSyetemElectron.Documents;
        break;
      case FileSystemPluginDirectory.Data:
        return FileSyetemElectron.Data;
        break;
      case FileSystemPluginDirectory.Cache:
        return FileSyetemElectron.Cache;
        break;
      case FileSystemPluginDirectory.External:
        return FileSyetemElectron.External;
        break;
      case FileSystemPluginDirectory.ExternalStorage:
        return FileSyetemElectron.ExternalStorage;
        break;
    }
  }

  private base64toBlob(b64Data: string, contentType: string, sliceSize: number = 2048): Blob {
    contentType = contentType || '';
    sliceSize = sliceSize || 1024 * 2;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i); }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  private getMimeType(fileType: string): string {
    switch (fileType) {
      case 'pdf':
        return 'application/pdf';
      case 'xls':
      case 'xlsx':
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default: return fileType;
    }
  }

}

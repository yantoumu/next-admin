/**
 * 文件处理工具
 */
export const fileUtils = {
  /**
   * 格式化文件大小 (如：1.5 MB)
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
  },

  /**
   * 获取文件扩展名
   */
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
  },

  /**
   * 检查是否为图片文件
   */
  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const ext = this.getFileExtension(filename).toLowerCase()
    return imageExtensions.includes(ext)
  },

  /**
   * 检查是否为视频文件
   */
  isVideoFile(filename: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
    const ext = this.getFileExtension(filename).toLowerCase()
    return videoExtensions.includes(ext)
  },

  /**
   * 检查是否为音频文件
   */
  isAudioFile(filename: string): boolean {
    const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg']
    const ext = this.getFileExtension(filename).toLowerCase()
    return audioExtensions.includes(ext)
  },

  /**
   * 生成安全的文件名
   */
  sanitizeFileName(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  },

  /**
   * 获取文件MIME类型
   */
  getMimeType(filename: string): string {
    const ext = this.getFileExtension(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain',
      'json': 'application/json',
      'xml': 'application/xml'
    }
    return mimeTypes[ext] || 'application/octet-stream'
  },

  /**
   * 将文件转换为Base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }
}
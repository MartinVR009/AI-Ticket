import { Logger } from '../../shared/logger';

export class GoogleDriveService {
  /**
   * Valida o normaliza un enlace a Google Drive
   */
  static validateDriveUrl(url?: string | null): boolean {
    if (!url) return true;
    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Simula o prepara metadatos de archivo de Drive
   */
  static extractDriveInfo(url?: string | null): { isDriveLink: boolean; fileId?: string } {
    if (!url) return { isDriveLink: false };
    const isDriveLink = url.includes('drive.google.com') || url.includes('docs.google.com');
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return {
      isDriveLink,
      fileId: match ? match[1] : undefined
    };
  }
}

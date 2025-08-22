
export const VEO_MODEL_NAME = 'veo-2.0-generate-001';

// Defines the available model choices for the UI.
// The data structure is updated to support a two-line display.
export const VEO_MODEL_CHOICES = [
    { id: 'veo-2.0-generate-001', name: 'VEO 2', subtext: '(veo-2.0-generate-001)' },
    { id: 'veo-3.0-generate-preview', name: 'VEO 3', subtext: '(veo-3.0-generate-preview)' },
] as const;


export const LOADING_MESSAGES = [
  'Memanaskan model AI...',
  'Menganalisis prompt dan gambar referensi Anda...',
  'Membuat frame video awal...',
  'Ini bisa memakan waktu beberapa menit, harap bersabar.',
  'Menyambungkan adegan...',
  'Menambahkan debu peri digital...',
  'Merender video final...',
  'Hampir selesai, memoles mahakarya!',
];
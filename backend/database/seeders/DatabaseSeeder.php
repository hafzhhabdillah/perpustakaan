<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (Admin and Regular User)
        $admin = User::firstOrCreate(
            ['email' => 'admin@library.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        $member = User::firstOrCreate(
            ['email' => 'user@library.test'],
            [
                'name' => 'Siswa Pembaca',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );

        // 2. Seed Categories
        $categoriesData = [
            [
                'name' => 'Teknologi & Pemrograman',
                'slug' => 'teknologi-pemrograman',
                'description' => 'Buku-buku tentang rekayasa perangkat lunak, komputasi awan, AI, dan bahasa pemrograman.',
            ],
            [
                'name' => 'Sains & Matematika',
                'slug' => 'sains-matematika',
                'description' => 'Eksplorasi ilmu alam, fisika modern, kosmologi, dan teori matematika terapan.',
            ],
            [
                'name' => 'Fiksi & Sastra',
                'slug' => 'fiksi-sastra',
                'description' => 'Karya sastra fiksi, novel petualangan, misteri, dan sci-fi terbaik dunia.',
            ],
            [
                'name' => 'Bisnis & Manajemen',
                'slug' => 'bisnis-manajemen',
                'description' => 'Wawasan seputar kewirausahaan, manajemen organisasi, strategi investasi, dan ekonomi.',
            ],
            [
                'name' => 'Pengembangan Diri',
                'slug' => 'pengembangan-diri',
                'description' => 'Panduan produktivitas, psikologi kebiasaan, kepemimpinan, dan kecerdasan emosional.',
            ],
            [
                'name' => 'Sejarah & Budaya',
                'slug' => 'sejarah-budaya',
                'description' => 'Dokumentasi peradaban masa lalu, biografi tokoh besar, dan studi kebudayaan global.',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. Seed Books
        $booksData = [
            [
                'category_id' => $categories['teknologi-pemrograman']->id,
                'title' => 'Clean Code: A Handbook of Agile Software Craftsmanship',
                'author' => 'Robert C. Martin',
                'publisher' => 'Prentice Hall',
                'published_year' => 2008,
                'isbn' => '9780132350884',
                'description' => 'Panduan legendaris tentang bagaimana menulis kode yang bersih, mudah dibaca, dan mudah di-maintain untuk software developer profesional.',
                'cover_image' => 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
                'stock' => 5,
            ],
            [
                'category_id' => $categories['teknologi-pemrograman']->id,
                'title' => 'Python Crash Course: A Hands-On, Project-Based Introduction to Programming',
                'author' => 'Eric Matthes',
                'publisher' => 'No Starch Press',
                'published_year' => 2023,
                'isbn' => '9781718502703',
                'description' => 'Buku pengantar pemrograman bahasa Python nomor satu untuk pemula lengkap dengan latihan proyek aplikasi web dan visualisasi data.',
                'cover_image' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
                'stock' => 8,
            ],
            [
                'category_id' => $categories['teknologi-pemrograman']->id,
                'title' => 'Designing Data-Intensive Applications',
                'author' => 'Martin Kleppmann',
                'publisher' => 'O\'Reilly Media',
                'published_year' => 2017,
                'isbn' => '9781449373320',
                'description' => 'Analisis mendalam mengenai arsitektur sistem terdistribusi, database storage engine, batch processing, dan streaming data skala besar.',
                'cover_image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                'stock' => 4,
            ],
            [
                'category_id' => $categories['sains-matematika']->id,
                'title' => 'A Brief History of Time',
                'author' => 'Stephen Hawking',
                'publisher' => 'Bantam Books',
                'published_year' => 1988,
                'isbn' => '9780553380163',
                'description' => 'Penjelasan menakjubkan tentang asal mula alam semesta, lubang hitam, teori relativitas umum, dan mekanika kuantum dalam bahasa populer.',
                'cover_image' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
                'stock' => 6,
            ],
            [
                'category_id' => $categories['sains-matematika']->id,
                'title' => 'Cosmos',
                'author' => 'Carl Sagan',
                'publisher' => 'Random House',
                'published_year' => 1980,
                'isbn' => '9780345331359',
                'description' => 'Sebuah perjalanan filosofis dan ilmiah menelusuri kosmos, perkembangan sains, serta masa depan peradaban umat manusia di antara bintang-bintang.',
                'cover_image' => 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
                'stock' => 5,
            ],
            [
                'category_id' => $categories['fiksi-sastra']->id,
                'title' => 'Laskar Pelangi',
                'author' => 'Andrea Hirata',
                'publisher' => 'Bentang Pustaka',
                'published_year' => 2005,
                'isbn' => '9789793062792',
                'description' => 'Kisah inspiratif tentang perjuangan sepuluh anak di Belitung dalam menempuh pendidikan di tengah segala keterbatasan fasilitas sekolah.',
                'cover_image' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
                'stock' => 10,
            ],
            [
                'category_id' => $categories['fiksi-sastra']->id,
                'title' => 'Bumi Manusia',
                'author' => 'Pramoedya Ananta Toer',
                'publisher' => 'Hasta Mitra',
                'published_year' => 1980,
                'isbn' => '9789799731234',
                'description' => 'Masterpiece sastra Indonesia berlatar era kolonial akhir abad ke-19, mengisahkan Minke dan perjuangan kesetaraan hak martabat manusia.',
                'cover_image' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
                'stock' => 7,
            ],
            [
                'category_id' => $categories['pengembangan-diri']->id,
                'title' => 'Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa',
                'author' => 'James Clear',
                'publisher' => 'Gramedia Pustaka Utama',
                'published_year' => 2019,
                'isbn' => '9786020633176',
                'description' => 'Strategi praktis terbukti untuk membangun kebiasaan baik dan menghentikan kebiasaan buruk dengan sistem perbaikan 1% setiap hari.',
                'cover_image' => 'https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=600&q=80',
                'stock' => 12,
            ],
            [
                'category_id' => $categories['pengembangan-diri']->id,
                'title' => 'Filosofi Teras: Hindari Stres dengan Ajaran Stoikisme',
                'author' => 'Henry Manampiring',
                'publisher' => 'Buku Kompas',
                'published_year' => 2018,
                'isbn' => '9786024125189',
                'description' => 'Penerapan praktis filsafat stoisisme kuno Yunani-Romawi dalam menghadapi kecemasan, overthinking, dan realitas kehidupan modern sehari-hari.',
                'cover_image' => 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
                'stock' => 9,
            ],
            [
                'category_id' => $categories['bisnis-manajemen']->id,
                'title' => 'Zero to One: Notes on Startups, or How to Build the Future',
                'author' => 'Peter Thiel',
                'publisher' => 'Crown Business',
                'published_year' => 2014,
                'isbn' => '9780804139298',
                'description' => 'Panduan membangun inovasi radikal dan bisnis baru yang menciptakan nilai baru alih-alih sekadar berkompetisi di pasar yang sudah ada.',
                'cover_image' => 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80',
                'stock' => 6,
            ],
            [
                'category_id' => $categories['sejarah-budaya']->id,
                'title' => 'Sapiens: Riwayat Singkat Umat Manusia',
                'author' => 'Yuval Noah Harari',
                'publisher' => 'KPG (Kepustakaan Populer Gramedia)',
                'published_year' => 2017,
                'isbn' => '9786024244163',
                'description' => 'Penelusuran menyeluruh tentang evolusi spesies Homo sapiens dari pemburu-pengumpul hingga menguasai bumi melalui revolusi kognitif dan industri.',
                'cover_image' => 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
                'stock' => 8,
            ],
        ];

        foreach ($booksData as $bData) {
            $book = Book::firstOrCreate(['isbn' => $bData['isbn']], $bData);

            // Tambahkan 3 buku pertama ke favorit akun member
            if (in_array($bData['isbn'], ['9780132350884', '9781718502703', '9786020633176'])) {
                Favorite::firstOrCreate([
                    'user_id' => $member->id,
                    'book_id' => $book->id,
                ]);
            }
        }
    }
}

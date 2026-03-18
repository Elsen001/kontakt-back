// Node.js built-in dns modulunu istifadə edərək Google/Cloudflare DNS-ə məcbur et
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8', '1.0.0.1', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require("mongodb");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGO_URI; // .env faylından MONGO_URI oxunur
const client = new MongoClient(uri);

app.use(cors());  // CORS-u aktiv edin
app.use(express.json());  // JSON məlumatlarını almaq üçün

// MongoDB-yə qoşulma funksiyası
async function run() {
  try {
    await client.connect();
    console.log('MongoDB-ə uğurla qoşuldu!');
  } catch (err) {
    console.log('MongoDB-ə qoşularkən xəta baş verdi:', err);
  }
}

run();

// Məhsulların siyahısını almaq üçün API endpointi
app.get('/api/products', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı
    const collection = database.collection("products");  // Collection adı

    // Məlumatları tapmaq
    const products = await collection.find({}).toArray();
    
    res.json(products);  // Məlumatları JSON formatında qaytarır
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err });
  }
});


app.get('/api/campaign', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı
    const collection = database.collection("campaign");  // Collection adı

    // Məlumatları tapmaq
    const campaign = await collection.find({}).toArray();
    
    res.json(campaign);  // Məlumatları JSON formatında qaytarır
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err });
  }
});

app.get('/api/offer', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı
    const collection = database.collection("offer");  // Collection adı

    // Məlumatları tapmaq
    const offer = await collection.find({}).toArray();
    
    res.json(offer);  // Məlumatları JSON formatında qaytarır
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err });
  }
});

app.get('/api/tv', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı
    const collection = database.collection("tv");  // Collection adı

    // Məlumatları tapmaq
    const tv = await collection.find({}).toArray();
    
    res.json(tv);  // Məlumatları JSON formatında qaytarır
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err });
  }
});

// Kategoriyaları almaq üçün API endpointi
app.get('/api/categories', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı
    const collection = database.collection("categories");  // Collection adı

    // Kategoriyaları tapmaq
    const categories = await collection.find({}).toArray();
    
    res.json({ data: categories });  // Məlumatları JSON formatında qaytarır
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err });
  }
});

app.get('/api/balance', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı
    const collection = database.collection("balance");  // Collection adı

    // Kategoriyaları tapmaq
    const balance = await collection.find({}).toArray();
    
    res.json({ data: balance });  // Məlumatları JSON formatında qaytarır
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Gələn ID:", id);

    // `id` number və ya `ObjectId` olub-olmadığını yoxla
    if (!ObjectId.isValid(id) && isNaN(Number(id))) {
      return res.status(400).json({ message: 'Yanlış ID formatı' });
    }

    // ✅ MongoDB bağlantısını yoxlayırıq
    if (!client || !client.topology || !client.topology.isConnected()) {
      console.error("Veritabanı bağlantısı yoxdur!");
      return res.status(500).json({ message: 'Veritabanı bağlantısı yoxdur' });
    }

    const database = client.db("Ecommerce");

    // Tüm koleksiyonların adlarını al
    const collections = await database.listCollections().toArray();

    // ✅ `id` MongoDB-də `ObjectId`, `string` və ya `number` ola bilər
    const query = ObjectId.isValid(id) 
      ? { _id: new ObjectId(id) } 
      : { id: Number(id) || id.toString() };

    console.log("Query:", query);

    let product = null;

    // Tüm koleksiyonlarda arama yap
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);

      // Koleksiyonda sorgu yap
      product = await collection.findOne(query);

      // Eğer ürün bulunursa, döngüden çık
      if (product) {
        console.log("Məlumat tapıldı:", collectionName);
        break;
      }
    }

    if (!product) {
      console.error("Məlumat tapılmadı!");
      return res.status(404).json({ message: 'Məlumat tapılmadı' });
    }

    res.json(product);
  } catch (err) {
    console.error("Server xətası:", err);
    res.status(500).json({ message: 'Xəta baş verdi', error: err.message });
  }
});

// YENİ: Hər məhsul üçün şərh (comment) bölməsi

// GET: Verilmiş məhsul ID-sinə uyğun şərhləri əldə et
// GET: Verilmiş məhsul ID-sinə uyğun şərhləri əldə et
app.get('/api/comments/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const database = client.db("Ecommerce");
    const commentsCollection = database.collection("comments");
    
    // Fetch comments for the product
    const comments = await commentsCollection.find({ productId: productId }).toArray();
    
    res.json({ data: comments });
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err.message });
  }
});

// POST: Yeni şərh əlavə et (body içərisində productId, userName, commentText, starRating)
app.post('/api/comments', async (req, res) => {
  try {
    const { productId, userName, commentText, starRating } = req.body;
    
    // Validate required fields
    if (!productId || !commentText || starRating === undefined) {
      return res.status(400).json({ message: 'Product ID, comment text, və star rating tələb olunur' });
    }
    
    const database = client.db("Ecommerce");
    const commentsCollection = database.collection("comments");

    const newComment = {
      productId,                    // Məhsul ID
      userName: userName || "Anonim",
      commentText,
      starRating: Number(starRating), // Ensure starRating is a number
      createdAt: new Date()         // Yaradılma tarixi
    };

    await commentsCollection.insertOne(newComment);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err.message });
  }
});


app.get('/api/all-collections', async (req, res) => {
  try {
    const database = client.db("Ecommerce");  // Database adı

    // Bütün collection adlarını al
    const collections = await database.listCollections().toArray();
    const result = {};

    // Hər bir collection üçün məlumatları çıxar
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);

      // Collectiondan bütün məlumatları çıxar
      const data = await collection.find({}).toArray();
      result[collectionName] = data;  // Məlumatları nəticə obyektinə əlavə et
    }

    res.json(result);  // Bütün məlumatları JSON formatında qaytar
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;  // Axtarış sözünü al
    if (!query) {
      return res.status(400).json({ message: 'Axtarış sözü tələb olunur' });
    }

    const database = client.db("Ecommerce");  // Database adı

    // Bütün collection adlarını al
    const collections = await database.listCollections().toArray();
    const results = [];

    // Hər bir collection üçün axtarış et
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);

      // Collectionda axtarış et
      const data = await collection.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },  // "name" sahəsində axtarış
          { title: { $regex: query, $options: 'i' } }, // "title" sahəsində axtarış
          { description: { $regex: query, $options: 'i' } }, // "description" sahəsində axtarış
          { brand: { $regex: query, $options: 'i' } }  // "brand" sahəsində axtarış
        ]
      }).toArray();

      // Əgər nəticə varsa, əlavə et
      if (data.length > 0) {
        results.push({ collection: collectionName, data });
      }
    }

    res.json(results);  // Axtarış nəticələrini JSON formatında qaytar
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi', error: err.message });
  }
});





// Serveri işə salın
app.listen(port, () => {
  console.log(`Server ${port} portunda işləyir!`);
});
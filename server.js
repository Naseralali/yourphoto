const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// إعداد CORS للسماح بالاتصال من الواجهة الأمامية
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/upload', (req, res) => {
    try {
        const imageData = req.body.image;
        if (!imageData) {
            return res.status(400).json({ message: 'لم يتم إرسال بيانات الصورة' });
        }

        const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
        const fileName = `photo_${Date.now()}.png`;
        const uploadsDir = path.join(__dirname, 'uploads');

        // إنشاء مجلد 'uploads' إذا لم يكن موجودًا
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const filePath = path.join(uploadsDir, fileName);

        // حفظ الصورة في المجلد
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error('خطأ في حفظ الصورة:', err);
                return res.status(500).json({ message: 'خطأ في حفظ الصورة' });
            }
            console.log('تم حفظ الصورة:', fileName);
            res.json({ message: 'تم حفظ الصورة بنجاح', fileName: fileName });
        });
    } catch (error) {
        console.error('خطأ غير متوقع:', error);
        res.status(500).json({ message: 'حدث خطأ غير متوقع' });
    }
});

app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});

const fs = require('fs');
const path = require('path');

// Đường dẫn tới file memory
const memoryPath = path.join(__dirname, 'memory', 'memory.json');

try {
    if (!fs.existsSync(memoryPath)) {
        console.error('❌ Không tìm thấy file memory.json. Hãy chạy pipeline trước!');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
    
    if (data.length === 0) {
        console.error('❌ Bộ nhớ trống. Chưa có code nào được tạo.');
        process.exit(1);
    }

    // Lấy task mới nhất
    const lastTask = data[data.length - 1];
    const code = lastTask.dev?.code;
    const lang = lastTask.dev?.language || 'txt';
    const ext = lang === 'python' ? 'py' : (lang === 'javascript' ? 'js' : 'txt');

    if (code) {
        const filename = `generated_app.${ext}`;
        fs.writeFileSync(filename, code);
        console.log(`\n✅ THÀNH CÔNG!`);
        console.log(`📍 Vị trí code: ${path.join(process.cwd(), filename)}`);
        console.log(`🚀 Bạn có thể chạy bằng lệnh: ${lang === 'python' ? 'python' : 'node'} ${filename}\n`);
    } else {
        console.log('⚠️ Không tìm thấy đoạn code nào trong task cuối cùng.');
    }
} catch (error) {
    console.error('❌ Lỗi:', error.message);
}

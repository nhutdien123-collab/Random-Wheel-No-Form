// 1. Cấu hình danh sách quà tặng
var prizes = [
    { text: "Chúc bạn may mắn lần sau", img: "images/hengaplai.png", percentpage: 0.45 },
    { text: "Bút bi ITC", img: "images/ButbiITC.png", percentpage: 0.00 },
    { text: "Bình nước", img: "images/binh.png", percentpage: 0.00 },
    { text: "Quạt ITC", img: "images/quat.png", percentpage: 0.00 },
    { text: "Chúc bạn may mắn lần sau", img: "images/hengaplai.png", percentpage: 0.45 },
    { text: "Gấu bông", img: "images/gaubong.png", percentpage: 0.00 },
    { text: "Check in nhận quà", img: "images/gift_Y.png", percentpage: 0.10 },
    { text: "Balo ITC", img: "images/balo.png", percentpage: 0.00 },
];

// --- CẤU HÌNH GOOGLE SHEETS ---
// Thay thế chuỗi bên dưới bằng URL Web App của Google Apps Script bạn đã tạo
const GOOGLE_APP_SCRIPT_URL = 'https://docs.google.com/spreadsheets/d/1PbDwnsHJZZmNVDJ42FTZMYBKgJbPB6IYk0IpvmdZh60/edit?gid=0#gid=0';

function sendDataToGoogleSheets(prize) {
    if (!GOOGLE_APP_SCRIPT_URL || GOOGLE_APP_SCRIPT_URL === 'https://docs.google.com/spreadsheets/d/1PbDwnsHJZZmNVDJ42FTZMYBKgJbPB6IYk0IpvmdZh60/edit?gid=0#gid=0') {
        console.warn("Chưa cấu hình link Google Apps Script. Vui lòng cập nhật GOOGLE_APP_SCRIPT_URL.");
        return;
    }

    const formData = new FormData();
    formData.append("prize", prize);

    fetch(GOOGLE_APP_SCRIPT_URL, {
        method: "POST",
        body: formData
    })
        .then(response => response.text())
        .then(data => console.log("Đã lưu dữ liệu thành công:", data))
        .catch(error => console.error("Lỗi khi lưu dữ liệu:", error));
}

// 2. Hàm tính toán tỉ lệ trúng giải
function randomIndex(prizes) {
    let rand = Math.random();
    let cumulativeProbability = 0;
    for (let i = 0; i < prizes.length; i++) {
        cumulativeProbability += prizes[i].percentpage;
        if (rand < cumulativeProbability) return i;
    }
    return prizes.length - 1;
}

// 3. Khởi tạo vòng quay
document.addEventListener("DOMContentLoaded", function () {
    hcLuckywheel.init({
        id: "luckywheel",
        config: function (callback) {
            callback && callback(prizes);
        },
        mode: "both",
        getPrize: function (callback) {
            var index = randomIndex(prizes);
            callback && callback([index, index]); // Trả về index trúng
        },
        gotBack: function (prizeText) {
            // Gửi dữ liệu giải thưởng vừa quay được về Google Sheets
            sendDataToGoogleSheets(prizeText);

            // Tìm thông tin quà dựa trên text trả về từ thư viện
            const prize = prizes.find(p => p.text === prizeText);

            if (!prizeText || prizeText.includes('may mắn')) {
                Swal.fire({
                    title: 'Lần này chưa may mắn rồi...',
                    text: 'Chúc bạn may mắn lần sau nhé!',
                    imageUrl: (prize && prize.img) ? prize.img : './images/hengaplai.png',
                    imageWidth: 100,
                    confirmButtonText: 'Thử lại',
                    customClass: { popup: 'simple-swal-popup', confirmButton: 'simple-swal-button' }
                });
            } else {
                Swal.fire({
                    title: '🎉 Chúc mừng bạn! 🎉',
                    text: `Bạn đã trúng: ${prizeText}`,
                    imageUrl: prize ? prize.img : '',
                    imageWidth: 150,
                    confirmButtonText: 'Nhận quà ngay',
                    customClass: { popup: 'simple-swal-popup', confirmButton: 'simple-swal-button' }
                });
            }
        }
    });
});
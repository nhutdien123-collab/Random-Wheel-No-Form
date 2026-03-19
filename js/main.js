// 1. Cấu hình danh sách quà tặng
var prizes = [
    { text: "Chúc bạn may mắn lần sau", img: "images/hengaplai.png", percentpage: 0.25 },
    { text: "Bút bi ITC", img: "images/ButbiITC.png", percentpage: 0.20 },
    { text: "Bình nước", img: "images/binh.png", percentpage: 0.10 },
    { text: "Quạt ITC", img: "images/quat.png", percentpage: 0.15 },
    { text: "Chúc bạn may mắn lần sau", img: "images/hengaplai.png", percentpage: 0.25 },
    { text: "Túi vải", img: "images/hengaplai.png", percentpage: 0.30 },
    { text: "Gấu bông", img: "images/gaubong.png", percentpage: 0.20 },
    { text: "Check in nhận quà", img: "images/check in.png", percentpage: 0.30 },
    { text: "Balo ITC", img: "images/balo.png", percentpage: 0.20 },
    { text: "Túi vải", img: "images/hengaplai.png", percentpage: 0.30 },
];

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

const API_URL = "https://sheetdb.io/api/v1/e9nazronnimq3";

const form = document.getElementById("bookingForm");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");

const TIMES = [
"08:00",
"09:00",
"10:00",
"11:00",
"12:00",
"13:00",
"14:00",
"15:00",
"16:00",
"17:00",
"18:00",
"19:00",
"20:00"
];

// Bugungi sanani minimal sana qilish
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
// Band vaqtlarni yashirish
async function updateAvailableTimes() {

    renderTimes();

    if (!dateInput.value) return;

    const bookings = await getBookings();

    const selectedDate = dateInput.value;

    const now = new Date();

    const todayString = now.toISOString().split("T")[0];

    const options = timeSelect.querySelectorAll("option");

    options.forEach(option => {

        if (!option.value) return;

        // Band vaqtlarni yashirish
        bookings.forEach(item => {

            if (item.date === selectedDate && item.time === option.value) {

                option.disabled = true;
                option.hidden = true;

            }

        });

        // Bugungi o'tib ketgan vaqtlarni yashirish
        if (selectedDate === todayString) {

            const hour = parseInt(option.value.split(":")[0]);

            if (hour <= now.getHours()) {

                option.disabled = true;
                option.hidden = true;

            }

        }

    });

}

dateInput.addEventListener("change", updateAvailableTimes);

// Telefon raqamini tekshirish
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", () => {

    phoneInput.value = phoneInput.value.replace(/[^\d+]/g, "");

});
// Formani yuborish
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const submitBtn = form.querySelector("button");

    submitBtn.disabled = true;
    submitBtn.textContent = "Yuborilmoqda...";

    const booking = {
        data: {
            name: document.getElementById("fullname").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: "Surxondaryo, Sho'rchi",
            service: document.getElementById("service").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value
        }
    };

    try {

        // Qayta tekshirish
        const bookings = await getBookings();

        const busy = bookings.some(item =>
            item.date === booking.data.date &&
            item.time === booking.data.time
        );

        if (busy) {

            alert("❌ Bu vaqt allaqachon band. Boshqa vaqtni tanlang.");

            updateAvailableTimes();

            submitBtn.disabled = false;
            submitBtn.textContent = "Qabulga yozilish";

            return;

        }

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(booking)

        });

        if (response.ok) {

            alert("✅ Qabulingiz muvaffaqiyatli yaratildi!\nTez orada siz bilan bog'lanamiz.");

            form.reset();

            renderTimes();

        } else {

            alert("❌ Ma'lumot yuborishda xatolik.");

        }

    } catch (error) {

        console.error(error);

        alert("❌ Internet yoki server bilan bog'liq muammo.");

    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Qabulga yozilish";

});

const API_URL = "https://sheetdb.io/api/v1/e9nazronnimq3";

const form = document.getElementById("bookingForm");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");

// Bugungi sanadan oldingi kunlarni bloklash
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

dateInput.min = `${yyyy}-${mm}-${dd}`;

// Vaqtlarni olish
async function loadBusyTimes() {

    if (!dateInput.value) return;

    const response = await fetch(API_URL);
    const data = await response.json();

    const options = timeSelect.querySelectorAll("option");

    options.forEach(option => {

        if (option.value === "") return;

        option.disabled = false;
        option.hidden = false;

    });

    data.forEach(item => {

        if (item.date === dateInput.value) {

            options.forEach(option => {

                if (option.value === item.time) {

                    option.disabled = true;
                    option.hidden = true;

                }

            });

        }

    });

}

dateInput.addEventListener("change", loadBusyTimes);
form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const booking = {

        data: {

            name: document.getElementById("fullname").value,

            phone: document.getElementById("phone").value,

            address: "Surxondaryo, Sho'rchi",

            service: document.getElementById("service").value,

            date: document.getElementById("date").value,

            time: document.getElementById("time").value

        }

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(booking)

        });

        if (response.ok) {

            alert("✅ Qabulingiz muvaffaqiyatli yaratildi!\n\nTez orada siz bilan bog'lanamiz.");

            form.reset();

            loadBusyTimes();

        } else {

            alert("❌ Xatolik yuz berdi. Qaytadan urinib ko'ring.");

        }

    } catch (error) {

        alert("❌ Internet yoki server bilan bog'liq muammo.");

    }

});
// Bugungi o'tib ketgan vaqtlarni yashirish
function hidePastTimes() {

    if (!dateInput.value) return;

    const now = new Date();

    const todayString = now.toISOString().split("T")[0];

    if (dateInput.value !== todayString) return;

    const currentHour = now.getHours();

    const options = timeSelect.querySelectorAll("option");

    options.forEach(option => {

        if (!option.value) return;

        const hour = parseInt(option.value.split(":")[0]);

        if (hour <= currentHour) {

            option.hidden = true;
            option.disabled = true;

        }

    });

}

// Sana o'zgarganda ishlaydi
dateInput.addEventListener("change", () => {

    loadBusyTimes();

    hidePastTimes();

});// Formani yuborishdan oldin vaqtni qayta tekshirish
async function isTimeAvailable(date, time) {

    const response = await fetch(API_URL);
    const bookings = await response.json();

    return !bookings.some(item =>
        item.date === date &&
        item.time === time
    );

}

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const submitBtn = form.querySelector("button");

    submitBtn.disabled = true;
    submitBtn.innerText = "Yuborilmoqda...";

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const available = await isTimeAvailable(date, time);

    if (!available) {

        alert("❌ Bu vaqt allaqachon band. Iltimos boshqa vaqtni tanlang.");

        loadBusyTimes();

        submitBtn.disabled = false;
        submitBtn.innerText = "Qabulga yozilish";

        return;

    }

    const booking = {

        data: {

            name: document.getElementById("fullname").value,

            phone: document.getElementById("phone").value,

            address: "Surxondaryo, Sho'rchi",

            service: document.getElementById("service").value,

            date: date,

            time: time

        }

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(booking)

        });

        if (response.ok) {

            alert("✅ Qabul muvaffaqiyatli yaratildi!");

            form.reset();

            loadBusyTimes();

        } else {

            alert("❌ Ma'lumot yuborilmadi.");

        }

    } catch (err) {

        alert("❌ Internet bilan bog'liq muammo.");

    }

    submitBtn.disabled = false;
    submitBtn.innerText = "Qabulga yozilish";

});

const LIFF_ID = "2010754159-BAb84dhl";
const MAKE_WEBHOOK =
    "https://hook.us2.make.com/ihrg6c2vcmqsfuqyyfkrd7b9ljyoaf43";

let selectedDate = "";
let selectedTime = "";

async function main() {
    try {
        await liff.init({
            liffId: LIFF_ID
        });

        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        const profile = await liff.getProfile();

        document.getElementById("name").textContent =
            "こんにちは " + profile.displayName + " さん";

        createCalendar();

        document.getElementById("reserveButton").onclick =
            reserveButtonClicked;

    } catch (error) {
        console.error(error);
        alert("初期化に失敗しました: " + error.message);
    }
}

function createCalendar() {
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "ja",

        height: "auto",
        contentHeight: "auto",

        headerToolbar: {
            left: "prev",
            center: "title",
            right: "next"
        },

        dateClick: function(info) {

            selectedDate = info.dateStr;
            selectedTime = "";

            showTimes();

            // 前回選択を解除
            document.querySelectorAll(".fc-day-selected")
                .forEach(el => el.classList.remove("fc-day-selected"));

            // 今回選択した日
            info.dayEl.classList.add("fc-day-selected");
        }
    });

    calendar.render();
}

function showTimes() {
    const div = document.getElementById("times");

    div.innerHTML = "";

    const times = [
        "10:00",
        "10:30",
        "11:00",
        "13:00",
        "13:30",
        "14:00"
    ];

    times.forEach(function (time) {
        const button = document.createElement("button");

        button.className = "timeButton";
        button.textContent = time;

        button.onclick = function () {
            selectedTime = time;

            document
                .querySelectorAll(".timeButton")
                .forEach(function (element) {
                    element.classList.remove("selected");
                });

            button.classList.add("selected");
        };

        div.appendChild(button);
    });
}

async function reserveButtonClicked() {
    if (selectedDate === "") {
        alert("日付を選択してください");
        return;
    }

    if (selectedTime === "") {
        alert("時間を選択してください");
        return;
    }

    try {
        const profile = await liff.getProfile();

        const data = {
            userId: profile.userId,
            name: profile.displayName,
            date: selectedDate,
            time: selectedTime
        };

        const response = await fetch(MAKE_WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        alert("予約データを送信しました！");

    } catch (error) {
        console.error(error);
        alert("送信に失敗しました: " + error.message);
    }
}

main();
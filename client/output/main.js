const route = (endpoint = "") => `http://localhost:5000${endpoint}`;
const contents = document.getElementById("contents");
let data = null,
    isLoading = false,
    isError = false,
    error = undefined;

function applySocket() {
    var socket = io(route());

    socket.on("new__history", function ({ history }) {
        console.log({ "New History": history, data });

        contents.insertAdjacentHTML("afterbegin", histories(history));
    });
}

applySocket();

const getHistories = async function () {
    try {
        isLoading = true;
        isError = false;
        error = undefined;

        const response = await fetch(route("/histories"));
        data = await response.json();
        contents.innerHTML = makeHistories(data);

        console.log(data);
    } catch (e) {
        error = e;
        isError = false;
        data = null;
        console.log("Error: ", e);
    } finally {
        isLoading = false;
    }
};

getHistories();

function makeHistories(data = []) {
    return data.map((history) => histories(history)).join(" ");
}

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// Array of months
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function histories({ id, timestamp, content, status, pin }) {
    const date = new Date(timestamp);
    return `
        <div class="p-2.5 rounded-xl bg-slate-900 mt-2">
            <div class="w-full border-b border-solid border-slate-700 pb-1 mb-2 flex justify-between items-center">
                <p class="text-sm italic text-slate-500">
                    <span class="text-secondary/60 not-italic font-bold pr-3">${id}</span>
                    ${weekdays[date.getDay()]}, 
                    ${months[date.getMonth()]}
                    ${date.getDate()}, 
                    ${date.getFullYear()} 
                    ${date.toLocaleTimeString()}
                </p>
                <ul class="flex gap-2">
                    <li class="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-slate-200 hover:bg-slate-100 hover:fill-slate-900 duration-500 cursor-pointer">
                        <i class="block size-4 leading-3 m-0 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M288 448L64 448l0-224 64 0 0-64-64 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-64-64 0 0 64zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"></path>
                            </svg>
                        </i>
                    </li>
                    <li class="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-cyan-200 hover:bg-cyan-500 hover:fill-slate-100 duration-500 cursor-pointer">
                        <i class="block size-4 leading-3 m-0 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path
                                    d="M481 31C445.1-4.8 386.9-4.8 351 31l-15 15L322.9 33C294.8 4.9 249.2 4.9 221.1 33L135 119c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L255 66.9c9.4-9.4 24.6-9.4 33.9 0L302.1 80 186.3 195.7 316.3 325.7 481 161c35.9-35.9 35.9-94.1 0-129.9zM293.7 348.3L163.7 218.3 99.5 282.5c-48 48-80.8 109.2-94.1 175.8l-5 25c-1.6 7.9 .9 16 6.6 21.7s13.8 8.1 21.7 6.6l25-5c66.6-13.3 127.8-46.1 175.8-94.1l64.2-64.2z"
                                ></path>
                            </svg>
                        </i>
                    </li>
                    <li class="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-violet-200 hover:bg-violet-500 hover:fill-slate-100 duration-500 cursor-pointer">
                        <i class="block size-4 leading-3 m-0 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path
                                    d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3L32 352c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 384l64 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96z"
                                ></path>
                            </svg>
                        </i>
                    </li>
                    <li class="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-red-200 hover:bg-red-500 hover:fill-slate-100 duration-500 cursor-pointer">
                        <i class="block size-4 leading-3 m-0 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path
                                    d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
                                ></path>
                            </svg>
                        </i>
                    </li>
                </ul>
            </div>
            <div class="text-md leading-[1.3] text-slate-300">
                ${sliceText(content)}
            </div>
        </div>
    `;
}

function sliceText(text = "", limit = 100, end = "...") {
    let newText = "";
    if (text.length <= limit) {
        newText = text;
    } else {
        newText = text.slice(0, limit) + end;
    }

    return newText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

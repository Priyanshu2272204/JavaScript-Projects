function createToaster(config) {
    return function (notification) {
        let div = document.createElement("div");
        div.classList = `inline-block ${config.theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text.black"} px-6 py-3 rounded shadow-lg pointer-events-none transition-opacity duration-3s`;
        div.textContent = notification;
        document.querySelector(".parent").appendChild(div);

        if (config.positionX !== "left" || config.positionY !== "top") {
            document.querySelector(".parent").className += `${config.positionX === "right" ? " right-5" : " left-5"} ${config.positionY === "top" ? " top-5" : " bottom-5"}`;
        }

        setTimeout(function () {
            document.querySelector(".parent").removeChild(div);
        }, config.duration * 1000);
    }
}

let toaster = createToaster({
    positionX: "right",
    positionY: "bottom",
    theme: "dark",
    duration: 3
});

toaster("Download Done!");
setTimeout(() => {
    toaster("Sam Altman Fuck You!");
}, 2000);
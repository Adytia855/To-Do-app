const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const inputButton = document.getElementById("input-button");
inputButton.addEventListener("click", addTask);
// Ambil data dari localStorage saat halaman dibuka
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Tambah task saat tombol ditekan
function addTask() {
	console.log("Input value:", `"${inputBox.value}"`);
	const taskText = inputBox.value.trim();
	if (taskText === "") {
		alert("Task tidak boleh kosong!");
		return;
	}
	const task = {
		text: taskText,
		done: false,
		timestamp: new Date().toLocaleString(),
	};
	tasks.push(task);
	saveTasks();
	renderTasks();
	inputBox.value = "";
}



// Simpan tasks ke localStorage
function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Tampilkan semua tasks
function renderTasks() {
	listContainer.innerHTML = "";

	tasks.forEach((task, index) => {
		const li = document.createElement("li");
		li.className =
			"flex flex-col bg-white text-black px-4 py-2 rounded-xl mb-2 shadow";

		// Baris atas (teks + tombol)
		const row = document.createElement("div");
		row.className = "flex justify-between items-center";

		const span = document.createElement("span");
		span.textContent = task.text;
		if (task.done) {
			span.classList.add("line-through", "text-gray-400");
		}
		row.appendChild(span);

		const btnWrapper = document.createElement("div");

		// Tombol done
		const doneBtn = document.createElement("button");
		doneBtn.textContent = "✓";
		doneBtn.className =
			"text-green-600 font-bold ml-2 hover:text-green-800 transition";
		doneBtn.onclick = () => {
			task.done = !task.done;
			saveTasks();
			renderTasks();
		};
		btnWrapper.appendChild(doneBtn);

		// Tombol hapus
		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "🗑️";
		deleteBtn.className =
			"text-red-500 font-bold ml-2 hover:text-red-700 transition";
		deleteBtn.onclick = () => {
			gsap.to(li, {
				opacity: 0,
				scale: 0.8,
				duration: 0.6,
				ease: "power1.in",
				onComplete: () => {
					// Setelah animasi selesai, hapus task dan render ulang
					tasks.splice(index, 1);
					saveTasks();
					renderTasks();
				},
			});
		};
		btnWrapper.appendChild(deleteBtn);
		
		row.appendChild(btnWrapper);
		li.appendChild(row);
		
		// Tampilkan waktu input
		const timeLabel = document.createElement("small");
		timeLabel.textContent = task.timestamp;
		timeLabel.className = "text-xs text-gray-500 mt-1";
		li.appendChild(timeLabel);

		listContainer.appendChild(li);

		gsap.from(li, {
			opacity: 0,
			y: -20,
			duration: 0.9,
			ease: "power2.out",
		});
	});
};

// Jika tekan ENTER di input, tambah task
inputBox.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		addTask();
	}
});




// Get references to the DOM elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const inputButton = document.getElementById("input-button");

// Add event listener to the input button to trigger addTask function
inputButton.addEventListener("click", addTask);

// Load tasks from localStorage when the page loads.
// If no tasks are found, initialize with an empty array.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// Render the loaded tasks
renderTasks();

/**
 * Adds a new task to the tasks array and updates the display.
 * Triggered by clicking the add button or pressing Enter in the input field.
 */
function addTask() {
	// console.log("Input value:", `"${inputBox.value}"`); // Optional: for debugging
	const taskText = inputBox.value.trim();
	if (taskText === "") {
		alert("Task cannot be empty!");
		return;
	}
	const task = {
		text: taskText,
		done: false,
		timestamp: new Date().toLocaleString(),
	};
	tasks.push(task);
	// Save the updated tasks array to localStorage
	saveTasks();
	// Re-render the task list
	renderTasks();
	// Clear the input box
	inputBox.value = "";
}



/**
 * Saves the current tasks array to the browser's localStorage.
 */
function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Renders the tasks array to the list container in the DOM.
 */
function renderTasks() {
	listContainer.innerHTML = "";

	tasks.forEach((task, index) => {
		const li = document.createElement("li");
		li.className =
			"flex flex-col bg-white text-black px-4 py-2 rounded-xl mb-2 shadow";
		li.setAttribute('data-index', index); // Add data attribute for potential future use or debugging

		// Create the top row for task text and buttons
		const row = document.createElement("div");
		row.className = "flex justify-between items-center";

		// Create span for task text
		const span = document.createElement("span");
		span.textContent = task.text;
		// Add line-through class if the task is marked as done
		if (task.done) {
			span.classList.add("line-through", "text-gray-400");
		}
		row.appendChild(span);

		const btnWrapper = document.createElement("div");

		// Tombol done
		const doneBtn = document.createElement("button");
		doneBtn.textContent = "✓";
		doneBtn.className = `text-green-600 font-bold ml-2 hover:text-green-800 transition ${task.done ? 'opacity-50' : ''}`; // Dim button if task is done
		doneBtn.title = task.done ? 'Mark as not done' : 'Mark as done'; // Add title for accessibility
		doneBtn.onclick = () => {
			task.done = !task.done;
			saveTasks();
			// Re-render to update the UI (line-through, button opacity)
			renderTasks();
		};
		btnWrapper.appendChild(doneBtn);

		// Tombol hapus
		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "🗑️";
		deleteBtn.className =
			"text-red-500 font-bold ml-2 hover:text-red-700 transition"; // Use ml-2 for spacing
		deleteBtn.title = 'Delete task'; // Add title for accessibility
		deleteBtn.onclick = () => {
			// Use GSAP for a smooth delete animation
			gsap.to(li, {
				opacity: 0,
				scale: 0.8,
				duration: 0.6,
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
		
		// Create and append the timestamp label
		const timeLabel = document.createElement("small");
		timeLabel.textContent = task.timestamp;
		timeLabel.className = "text-xs text-gray-500 mt-1";
		li.appendChild(timeLabel);

		// Append the complete list item to the list container
		listContainer.appendChild(li);

		// Use GSAP for a smooth entrance animation
		gsap.from(li, {
			opacity: 0,
			y: -20,
			duration: 0.9,
			ease: "power2.out",
		});
	});
};

/**
 * Adds an event listener to the input box to trigger addTask when the Enter key is pressed.
 * @param {KeyboardEvent} event - The keyup event object.
 */
inputBox.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		addTask();
	}
});

const API_URL = "https://disease-api-zto5.onrender.com/predict";
let allSymptoms = [];

// Load symptoms
fetch("symptom_list.json")
    .then(res => res.json())
    .then(data => {
        allSymptoms = data;
        renderSymptoms(data);
    });

function renderSymptoms(symptoms) {
    const container = document.getElementById("symptomList");
    container.innerHTML = "";

    symptoms.forEach(symptom => {
        const div = document.createElement("div");
        div.className = "checkbox-item";

        div.innerHTML = `
            <input type="checkbox" value="${symptom}">
            <label>${symptom}</label>
        `;

        container.appendChild(div);
    });
}

// Search filter
function filterSymptoms() {
    const query = document.getElementById("search").value.toLowerCase();
    const filtered = allSymptoms.filter(s => s.includes(query));
    renderSymptoms(filtered);
}

// Predict
function predict() {

    const checked = document.querySelectorAll("input[type='checkbox']:checked");
    const symptoms = Array.from(checked).map(c => c.value);

    if (symptoms.length === 0) {
        alert("Please select at least one symptom");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms })
    })
    .then(res => res.json())
    .then(data => {

        let output = "<h3>Predicted Diseases</h3>";
        data.forEach(item => {
            output += `
                <div class="result-card">
                    <b>${item.Disease}</b><br>
                    Probability: ${item.Probability}%
                </div>
            `;
        });

        document.getElementById("output").innerHTML = output;
    })
    .catch(() => alert("API connection failed"));
}


// Show selected symptoms live
function updateSelectedSymptoms() {
    const selectedBox = document.getElementById("selectedSymptoms");
    if (!selectedBox) return;

    selectedBox.innerHTML = "";

    const checked = document.querySelectorAll("input[type='checkbox']:checked");

    checked.forEach(c => {
        const chip = document.createElement("span");
        chip.className = "symptom-chip";
        chip.innerText = c.value;
        selectedBox.appendChild(chip);
    });
}

// Detect checkbox changes (event delegation)
document.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
        updateSelectedSymptoms();
    }
});

// Add loading animation to button
const originalPredict = predict;
predict = function () {

    const btn = document.querySelector("button");
    const originalText = btn.innerHTML;

    btn.innerHTML = "⏳ Predicting...";
    btn.disabled = true;

    originalPredict();

    // restore button after API response
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        // smooth scroll to result
        document.getElementById("output")
            .scrollIntoView({ behavior: "smooth" });

    }, 1200);
};

const form = document.getElementById("coverLetterForm");
const loading = document.getElementById("loading");
const outputSection = document.getElementById("outputSection");
const output = document.getElementById("coverLetterOutput");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("candidateName").value.trim();
    const jobRole = document.getElementById("jobRole").value.trim();
    const company = document.getElementById("company").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const jobDescription = document.getElementById("jobDescription").value.trim();

    if (
        !name ||
        !jobRole ||
        !company ||
        !skills ||
        !jobDescription
    ) {
        alert("Please fill all fields.");
        return;
    }

    loading.classList.remove("hidden");
    outputSection.classList.add("hidden");

    try {

        const response = await fetch(
            "https://cover-letter-generator-nbzs.onrender.com/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    jobRole,
                    company,
                    skills,
                    jobDescription
                })
            }
        );

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        loading.classList.add("hidden");

        if (data.success) {

            output.value = data.letter;
            outputSection.classList.remove("hidden");

        } else {

            alert(data.message || "Unable to generate cover letter.");

        }

    } catch (error) {

        loading.classList.add("hidden");

        console.error(error);

        alert("Unable to connect to the backend server.");

    }

});

// ==============================
// Copy Button
// ==============================

copyBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(output.value);

    copyBtn.innerText = "✅ Copied";

    setTimeout(() => {
        copyBtn.innerText = "📋 Copy";
    }, 2000);

});

const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {

    form.reset();

    outputSection.classList.add("hidden");

    loading.classList.add("hidden");

});

downloadBtn.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const text = output.value;

    const lines = doc.splitTextToSize(text, 180);

    doc.setFont("Times", "Normal");

    doc.setFontSize(12);

    doc.text(lines, 15, 20);

    doc.save("Cover_Letter.pdf");

});
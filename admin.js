document.getElementById("sendBtn")?.addEventListener("click", () => {
  const targetInput = document.getElementById("target");
  const bugTypeSelect = document.getElementById("bug-type");
  const targetRaw = targetInput.value.trim();
  const bugType = bugTypeSelect.value;

  // Bersihkan nomor target hanya angka
  const target = targetRaw.replace(/\D/g, "");
  if (!target) {
    alert("Masukkan nomor target yang valid (hanya angka).");
    return;
  }

  fetch("/api/crash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, bugType, durationHours: 1 })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Sukses: ${data.message}`);
    } else {
      alert(`Gagal: ${data.message || "Terjadi kesalahan"}`);
    }
  })
  .catch(err => alert("Crash failed! Error: " + err.message));
});
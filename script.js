// Function to show custom push alert message
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.textContent = message;
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 1500); // 1.5 seconds later, it will disappear
}

// Function to send a message to Telegram users
function sendMessage() {
    // Get input values
    const botToken = document.getElementById("bot-token").value.trim();
    const chatIds = document.getElementById("chat-ids").value.trim();
    const customMessage = document.getElementById("custom-message").value.trim();
    const uploadFile = document.getElementById("fileInput").files[0];
    const customButtons = document.getElementById("custom-button").value.trim();

    // Validate inputs
    if (!botToken) {
        showAlert("Please enter your Bot Token.");
        return;
    }
    if (!chatIds) {
        showAlert("Please enter at least one Chat ID.");
        return;
    }
    if (!customMessage && !uploadFile) {
        showAlert("Please enter a custom message or upload an image.");
        return;
    }

    // Validate file type (only images allowed)
    if (uploadFile && !uploadFile.type.startsWith("image/")) {
        showAlert("Only image files are allowed. Please upload a valid image.");
        return;
    }

    // Prepare unique chat IDs (remove duplicates)
    const chatIdArray = Array.from(new Set(chatIds.split(/[\n,]+/).map(id => id.trim()).filter(id => id)));

    // Track failed messages
    let failedChats = [];

    // Iterate through chat IDs and send messages
    const promises = chatIdArray.map(chatId => {
        return new Promise(resolve => {
            const formData = new FormData();
            formData.append("chat_id", chatId);

            if (uploadFile) {
                formData.append("photo", uploadFile);
                if (customMessage) {
                    formData.append("caption", customMessage);
                }
            } else {
                formData.append("text", customMessage);
            }

            if (customButtons) {
                const inlineKeyboard = customButtons.split("\n").map(buttonLine => {
                    const buttons = buttonLine.split("|").map(button => {
                        const [text, url] = button.split(" - ");
                        return { text: text.trim(), url: url.trim() };
                    });
                    return buttons;
                });
                formData.append("reply_markup", JSON.stringify({ inline_keyboard: inlineKeyboard }));
            }

            const endpoint = uploadFile
                ? `https://api.telegram.org/bot${botToken}/sendPhoto`
                : `https://api.telegram.org/bot${botToken}/sendMessage`;

            fetch(endpoint, {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        resolve({ success: true, chatId });
                    } else {
                        failedChats.push(chatId);
                        resolve({ success: false, chatId });
                    }
                })
                .catch(error => {
                    failedChats.push(chatId);
                    resolve({ success: false, chatId });
                });
        });
    });

    Promise.all(promises).then(results => {
        const successCount = results.filter(result => result.success).length;

        if (successCount > 0) {
            showAlert("Message sent successfully.");
        }
        if (failedChats.length > 0) {
            console.error(`Failed Chat IDs: ${failedChats.join(", ")}`);
        }
    });
}

// File upload preview system
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const previewBtn = document.getElementById("previewBtn");
const removeBtn = document.getElementById("remove-pr-Btn");
const previewPopup = document.getElementById("previewPopup");
const previewImage = document.getElementById("previewImage");
const closePopup = document.getElementById("close-PR-Popup");

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName.textContent = file.name;
        previewBtn.hidden = false;
        removeBtn.hidden = false;

        const fileReader = new FileReader();
        fileReader.onload = () => {
            previewImage.src = fileReader.result;
        };
        fileReader.readAsDataURL(file);
    }
});

previewBtn.addEventListener("click", () => {
    previewPopup.classList.remove("hidden");
});

removeBtn.addEventListener("click", () => {
    fileInput.value = "";
    fileName.textContent = "No file chosen";
    previewBtn.hidden = true;
    removeBtn.hidden = true;
});

closePopup.addEventListener("click", () => {
    previewPopup.classList.add("hidden");
});





// Generate Initial Random OTP
    function generateRandomOTP() {
      const randomOTP = Math.floor(1000 + Math.random() * 900000); // 4 to 6 digits
      const otpDisplay = document.getElementById('otpDisplay');
      otpDisplay.innerText = randomOTP;

      // Add animation
      otpDisplay.classList.add('shake');
      setTimeout(() => {
        otpDisplay.classList.remove('shake');
      }, 300);
    }

    // Copy OTP to Clipboard
    function copyOTP() {
      const otp = document.getElementById('otpDisplay').innerText;
      navigator.clipboard.writeText(otp).then(() => {
        const copyBtn = document.querySelector('.button.copy');
        copyBtn.innerText = 'Copied!';
        setTimeout(() => {
          copyBtn.innerText = 'Copy';
        }, 2000);
      });
    }

    // Toggle Custom OTP Input Box
    function toggleCustomInput() {
      const inputBox = document.getElementById('customInputBox');
      const customBtn = document.getElementById('customBtn');

      if (inputBox.style.display === 'block') {
        inputBox.style.display = 'none';
        customBtn.innerText = 'Custom';
        customBtn.style.backgroundColor = '#FF9800';
      } else {
        inputBox.style.display = 'block';
        customBtn.innerText = 'Close';
        customBtn.style.backgroundColor = '#FF5722';
      }
    }

    // Set Custom OTP
    function setCustomOTP(event) {
      if (event.key === 'Enter') {
        const customOTP = document.getElementById('customOTP').value.trim();
        if (customOTP !== '' && !isNaN(customOTP)) {
          document.getElementById('otpDisplay').innerText = customOTP;
          toggleCustomInput();
          document.getElementById('customOTP').value = ''; // Clear input
        } else {
          alert('Please enter a valid numeric OTP.');
        }
      }
    }

    // Generate a random OTP when the page loads
    generateRandomOTP();
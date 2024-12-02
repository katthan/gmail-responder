document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
  
    const existingMessage = document.getElementById('analyze-tone');
    if (existingMessage) {
      existingMessage.remove();
    }
  
    // Only proceed if text is selected
    if (selectedText.length > 0 && (window.location.host.includes('mail.google.com') || window.location.host.includes('x.com'))) {
      const range = selection.getRangeAt(0); // Get the range of the selection
      const rect = range.getBoundingClientRect(); // Get the position of the selected text
      const message = document.createElement('div'); // Create the message element
  
      // Set message content and styles
      message.textContent = 'Analyzing...';
      message.id = 'analyze-tone';
      message.style.position = 'absolute';
      message.style.top = `${rect.bottom + window.scrollY+10}px`; // Position below the selected text
      message.style.left = `${rect.left + window.scrollX}px`;
      message.style.backgroundColor = '#2E6F40';
      message.style.color = 'white';
      message.style.padding = '5px 10px';
      message.style.borderRadius = '4px';
      message.style.fontSize = '14px';
      message.style.zIndex = '1000';
      message.style.cursor = 'pointer';
  
      // Append the message to the document
      document.body.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 5000);

      if (selectedText.length > 0) {
        // Send the selected text to the background script
        chrome.runtime.sendMessage({ type: 'textSelected', text: selectedText });
      }
    }
  });

  chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    let message = request;
    if (message.type === 'toneResult') {
      const toneResult = message.tone;
  
      // Remove any existing tone message
      const existingMessage = document.getElementById('analyze-tone');
      if (existingMessage) {
        existingMessage.remove();
      }

      if(toneResult.length > 0 && 
        (window.location.host.includes('google.com') || window.location.host.includes('x.com'))){

        console.log(window.location);
        // Create a new tone message
        const toneMessage = document.createElement('div');
        toneMessage.id = 'analyze-tone';
        toneMessage.textContent = `Tone: ${toneResult}`;
        toneMessage.style.position = 'absolute';
        toneMessage.style.backgroundColor = '#2E6F40';
        toneMessage.style.color = 'white';
        toneMessage.style.padding = '5px 10px';
        toneMessage.style.borderRadius = '4px';
        toneMessage.style.fontSize = '14px';
        toneMessage.style.zIndex = '1000';
        toneMessage.style.cursor = 'pointer';
    
        // Get the position of the selected text
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        toneMessage.style.top = `${rect.bottom + window.scrollY + 10}px`;
        toneMessage.style.left = `${rect.left + window.scrollX}px`;
    
        // Append to the body
        document.body.appendChild(toneMessage);

        // Remove after 5 seconds
        setTimeout(() => {
          toneMessage.remove();
        }, 5000);
      }
    }
  });
  
  
function setupContextMenu() {
    chrome.contextMenus.create({
      id: 'reply',
      title: 'Reply',
      contexts: ['selection']
    });
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    setupContextMenu();
  });
  
  chrome.contextMenus.onClicked.addListener(async (data, tab) => {
    // Make sure the side panel is open.
    await chrome.sidePanel.open({ tabId: tab.id });
    try {
      const promptText = '';
      // Use the generative language model
      const session = await ai.languageModel.create({
        systemPrompt: `You are an email writer who drafts accurate, contextual responses, and professional emails.
                      Follow these points strictly:
                      1. Maintain a professional and appropriate tone.
                      2. Be through and address the points in the original email
                      3. Include proper email greeting and signature
                      4. Identify the tone of the original email`
      });

      const dataStream = await session.promptStreaming(
        `Write an email reply with these specifications:
         Original Email: "${data.selectionText}"
         
         Important: Strictly follow the length requirement and ensure the reply is contextual to the original email.`
      );

      let replyContent = '';
      let previousLength = 0;

      for await (const dataChunk of dataStream) {
        const newContent = dataChunk.slice(previousLength);
        replyContent += newContent;
        previousLength = dataChunk.length;
      }

      // Store the last word in chrome.storage.session.
      chrome.storage.session.set({ emailText: replyContent });
    } catch (error) {
      console.error('API error:', error);
      return true;
    }
  
  });

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'textSelected') {
      const selectedText = message.text;
  
      try {
        // Use Chrome Gemini API for tone analysis (example API call)
        const session = await ai.languageModel.create({
          systemPrompt: `You are an advanced tone analyzer and gives the user idea of what tone is used in the selected text.`,
        });
  
        let response = await session.prompt(
          `Analyze the tone of this text in one word: "${selectedText}".`
        );
  
        console.log("response", response);
        response = response.replace(/\*\*/g, '');
        
        let toneResult = response;
        // Send the tone back to the content script for display
        // chrome.runtime.sendMessage({ type: 'toneResult', tone: toneResult });
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "toneResult",
          tone: toneResult
      });
      } catch (error) {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "toneResult",
            tone: ''
        });
        console.error('Tone analysis failed:', error);
      }
    }
  });

  async function generateResponse(text){
    
  }
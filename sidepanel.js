const words = {
    extensions:
      'Extensions are software programs, built on web technologies (such as HTML, CSS, and JavaScript) that enable users to customize the Chrome browsing experience.',
    popup:
      "A UI surface which appears when an extension's action icon is clicked."
  };
  
  chrome.storage.session.get('emailText', ({ emailText }) => {
    updateDefinition(emailText);
  });
  
  chrome.storage.session.onChanged.addListener((changes) => {
    const lastWordChange = changes['emailText'];
  
    if (!lastWordChange) {
      return;
    }
  
    updateDefinition(lastWordChange.newValue);
  });

  document.getElementById("clear-response-button").addEventListener("click", function(){ 
    chrome.storage.session.set({ emailText: 'Please select text to generate response...' });

    updateDefinition(' ');
  });
  
  function updateDefinition(emailText) {
    // If the side panel was opened manually, rather than using the context menu,
    // we might not have a word to show the definition for.
    if (!emailText) return;
  
  
    // Show word and definition.
    document.body.querySelector('#side-panel-summary').innerText = emailText;
  }
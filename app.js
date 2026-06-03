const ingredientSections = document.querySelectorAll('.ingredient-section');
const canvas = document.querySelector('.whisk-canvas');
const canvasMessage = document.querySelector('.canvas-message p');
const promptBar = document.querySelector('.prompt-bar');
const promptInput = promptBar?.querySelector('input[name="prompt"]');
const showImagesButton = document.querySelector('.show-images');
const canvasGallery = document.querySelector('.canvas-gallery');

const defaultCanvasMessage = 'Add a subject, scene, or style to Whisk!';

const ingredientLabels = {
  subject: 'Subject',
  scene: 'Scene',
  style: 'Style',
};

const randomSuggestions = {
  subject: ['Golden retriever astronaut', 'Ceramic fox mascot', 'Tiny chef robot'],
  scene: ['Sunlit kitchen island', 'Misty mountain train', 'Neon market street'],
  style: ['Soft clay render', 'Editorial food photo', 'Warm watercolor sketch'],
};

function getIngredientName(section) {
  return ingredientLabels[section.dataset.ingredient] || 'Ingredient';
}

function setCanvasMessage(message) {
  canvasMessage.textContent = message;
}

function setDropCardLabel(section, message) {
  const dropLabel = section.querySelector('.drop-label');
  if (dropLabel) {
    dropLabel.textContent = message;
  }
}

function activateIngredient(section, action, detail = '') {
  ingredientSections.forEach((item) => item.classList.remove('is-active'));
  section.classList.add('is-active', 'is-populated');

  const ingredient = getIngredientName(section);
  const verb = action === 'random' ? 'Randomized' : action === 'upload' ? 'Uploaded' : 'Added';
  const label = detail || `${verb} ${ingredient.toLowerCase()}`;

  setDropCardLabel(section, label);
  setCanvasMessage(`${verb} ${ingredient}. Add more ingredients or write a prompt!`);
}

function pickRandomSuggestion(section) {
  const choices = randomSuggestions[section.dataset.ingredient] || [getIngredientName(section)];
  return choices[Math.floor(Math.random() * choices.length)];
}

function renderGeneratedImages(promptText) {
  if (!canvasGallery) return;

  const populatedIngredients = [...ingredientSections]
    .filter((section) => section.classList.contains('is-populated'))
    .map((section) => getIngredientName(section));
  const baseLabel = promptText || populatedIngredients.join(' + ') || 'Whisk mix';

  canvasGallery.replaceChildren();
  ['01', '02', '03', '04'].forEach((number) => {
    const tile = document.createElement('article');
    const tileNumber = document.createElement('span');
    const tileLabel = document.createElement('p');

    tile.className = 'image-tile';
    tileNumber.textContent = number;
    tileLabel.textContent = baseLabel;
    tile.append(tileNumber, tileLabel);
    canvasGallery.append(tile);
  });
  canvasGallery.setAttribute('aria-hidden', 'false');
  canvasGallery.classList.add('has-images', 'is-visible');
  showImagesButton.classList.add('is-active');
  showImagesButton.setAttribute('aria-pressed', 'true');
}

ingredientSections.forEach((section) => {
  const buttons = section.querySelectorAll('.icon-button');
  const dropCard = section.querySelector('.drop-card');
  const fileInput = section.querySelector('.file-input');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.action === 'upload') {
        ingredientSections.forEach((item) => item.classList.remove('is-active'));
        section.classList.add('is-active');
        setCanvasMessage(`Choose an image for ${getIngredientName(section)}.`);
        fileInput?.click();
        return;
      }

      const detail = button.dataset.action === 'random' ? pickRandomSuggestion(section) : '';
      activateIngredient(section, button.dataset.action, detail);
    });
  });

  fileInput?.addEventListener('change', () => {
    const fileName = fileInput.files?.[0]?.name || 'Uploaded image';
    activateIngredient(section, 'upload', fileName);
  });

  dropCard.addEventListener('click', () => activateIngredient(section, 'add'));

  dropCard.addEventListener('dragover', (event) => {
    event.preventDefault();
    section.classList.add('is-dropping');
  });

  dropCard.addEventListener('dragleave', () => {
    section.classList.remove('is-dropping');
  });

  dropCard.addEventListener('drop', (event) => {
    event.preventDefault();
    section.classList.remove('is-dropping');
    const fileName = event.dataTransfer?.files?.[0]?.name || 'Dropped image';
    activateIngredient(section, 'upload', fileName);
  });
});

promptBar.addEventListener('submit', (event) => {
  event.preventDefault();
  const promptText = promptInput?.value.trim() || '';

  canvas.classList.add('is-generating');
  setCanvasMessage('Generating your Whisk image mix...');

  window.setTimeout(() => {
    canvas.classList.remove('is-generating');
    renderGeneratedImages(promptText);
    setCanvasMessage(promptText ? `Generated images for “${promptText}”.` : defaultCanvasMessage);
  }, 1200);
});

showImagesButton.addEventListener('click', () => {
  const isActive = showImagesButton.classList.toggle('is-active');
  showImagesButton.setAttribute('aria-pressed', String(isActive));
  canvasGallery?.classList.toggle('is-visible', isActive);
  canvasGallery?.setAttribute('aria-hidden', String(!isActive));
});

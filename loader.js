let projectCount = 0;
init();

async function init() {
  const projectsResponse = await fetch('seed.json');
  const projectsData = await projectsResponse.json();
  await loadProjects(projectsData);

  const pictuesResponse = await fetch('assetInfo.json');
  const pictuesData = await pictuesResponse.json();
  loadPictures(pictuesData);
}

async function loadProjects(projects) {
  let index = 0;

  const navbar = document.getElementById('navbar');
  const projectsContainer = document.getElementById('projects-container');
  projects.forEach(project => {
    const projectDiv = document.createElement('section');
    projectDiv.classList.add('project');
    projectDiv.id = `Project${index}`;

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image-section');
    const textDiv = document.createElement('div');
    textDiv.classList.add('text-section');

    imageDiv.innerHTML = `<img src="${project.image}" alt="${project.title}" title="${project.title}">`;
    projectDiv.appendChild(imageDiv);

    let html = `
    <h2>${project.title}</h2>
    <p>${project.description}</p>
    `;

    if (project.source) {
      html += `<a href="${project.source}" target="_blank"> ${project.sourcename} </a>`;
    }

    textDiv.innerHTML = html;


    projectDiv.appendChild(textDiv);
    projectsContainer.appendChild(projectDiv);

    const navItem = document.createElement('li');
    navItem.id = index;
    index++;

    let loops = 30 - (project.tag.length + 1 + project.title.length);
    let stringFiller = "";
    for (let i = 0; i < loops; i++) {
      stringFiller += ".";
    }

    navItem.innerHTML = `
      <span class="projecttag">${project.tag}</span> 
      <span class="projecttitle">${project.title}</span> 
      ${stringFiller} ${Number(navItem.id) + 1}
    `;

    navItem.addEventListener('click', () => {
      document.getElementById(`Project${navItem.id}`).scrollIntoView({ behavior: 'smooth' });
    });

    navbar.appendChild(navItem);
    projectCount++;
  });
}

async function loadPictures(pictues) {
  const picsoneList = pictues[0].picsone;
  const picsoneListInfo = pictues[0].picsoneinfo;
  const otherPicsList = pictues[1].picsrest;

  const picsOneContainer = document.getElementById('picsone-container');
  for (let i = 0; i < picsoneList.length; i++) {
    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('picture');
    pictureDiv.id = `top-picture${i}`;

    const imageName = picsoneList[i].split('/').pop().split('.')[0];
    pictureDiv.innerHTML = `<img src="${picsoneList[i]}" alt="${imageName}" title="${imageName}">`;

    const pos = picsoneListInfo[i].split(" ");

    pictureDiv.style.marginTop = pos[0];
    pictureDiv.style.marginRight = pos[1];

    picsOneContainer.appendChild(pictureDiv);
  }

  const picsTwoContainer = document.getElementById('picstwo-container');
  const picsThreeContainer = document.getElementById('picsthree-container');

  let picsCount = 2;
  if (projectCount > 1) {
    picsCount = projectCount * 2 - 6;
  }

  let chosenPics = getRandomizedPics(otherPicsList, picsCount);
  console.log(chosenPics.length);
  for (let i = 0; i < chosenPics.length; i++) {
    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('picture');
    pictureDiv.id = `bottom-picture${i}`;

    const imageName = chosenPics[i].split('/').pop().split('.')[0];
    pictureDiv.innerHTML = `<img src="${chosenPics[i]}" alt="${imageName}" title="${imageName}">`;

    pictureDiv.style.marginTop = '10vh';
    const randomRight = getRandomInt(-5, 5);
    pictureDiv.style.marginRight = `${randomRight}wh`;

    if (i % 2 == 0) {
      picsTwoContainer.appendChild(pictureDiv);
    } else {
      picsThreeContainer.appendChild(pictureDiv);
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomizedPics(pics, count, maxRetries = 5) {
  const result = [];

  for (let i = 0; i < count; i++) {
    let randomIndex = getRandomInt(0, pics.length);
    let retries = 0;

    while (result.includes(pics[randomIndex]) && retries < maxRetries) {
      randomIndex = getRandomInt(0, pics.length);
      retries++;
    }

    result.push(pics[randomIndex]);
  }
  return result;
}



//homepage initialization
let homepage = document.querySelector("#homepage>div");
//homepage.style.transform = `translateY(-100vh)`;

let homepageTitle = document.createElement('h1');
homepageTitle.id = 'title';
homepageTitle.innerText = 'Découvrez les chemins de fer suisses';

let homepageInviteToScroll = document.createElement('div');
homepageInviteToScroll.id = 'invite-to-scroll';
let inviteToScrollTagline = document.createElement('p');
inviteToScrollTagline.innerText = 'Défilez vers le bas pour commmencer votre voyage';
let inviteToScrollIcon = document.createElement('img');
inviteToScrollIcon.src = './src/assets/img/double-arrow-down.svg';
homepageInviteToScroll.append(inviteToScrollTagline);
homepageInviteToScroll.append(inviteToScrollIcon);

let homepageTrain = document.createElement('img');
homepageTrain.src = './src/assets/img/train.svg';
homepageTrain.id = 'train';

homepage.appendChild(homepageTitle);
homepage.appendChild(homepageInviteToScroll);
homepage.appendChild(homepageTrain);
//End of homepage initialization
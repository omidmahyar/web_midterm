// دریافت اطلاعات از سایت مبدا
async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}

// شماره صفحه را مشخص میکند
var state = {
    'querySet': null,
    'page': 1,
    'rows': 5,
}

// نام کشتی ها را در گروه های 5 تایی دسته یندی میکند تا در هر صفحه نمایش داده شود
function paging(querySet, page, rows) {
    const Start = (page - 1) * rows;
    const End = Start + rows;
    console.log(querySet);
    const medData = querySet.slice(Start, End);
    const pages = Math.ceil(querySet.length / rows);
    console.log(pages)
    return {
        'querySet': medData,
        'pages': pages
    }
}

//ساخت و افزودن دکمه های page به پنل
function pageButtons() {

    const prvPageBtn = document.createElement('button');
    const nextPageBtn = document.createElement('button');
    const backBtn = document.createElement('button');
    prvPageBtn.id = 'prv-button';
    nextPageBtn.id = 'next-button';
    backBtn.id = 'Back-button';
    prvPageBtn.innerText = "Prev";
    nextPageBtn.innerText = 'Next';
    backBtn.innerText = 'Back to Movies';
    const pageNumberlabel = document.createElement('label');
    pageNumberlabel.innerText = "Page-" + state.page;
    if (state.page + 1 > this.state.pages)
        nextPageBtn.disabled = true;
    if (state.page <= 1)
        prvPageBtn.disabled = true;
    prvPageBtn.addEventListener('click', PrvPageAction);
    nextPageBtn.addEventListener('click', NextPageAction);
    backBtn.addEventListener('click', buildFirstPage);
    const pageWrapper = document.createElement("div");
    pageWrapper.id = "pageWrapper";
    const pagesDiv = document.createElement('div');
    pagesDiv.className = 'pages-div';
    pagesDiv.appendChild(prvPageBtn);
    pagesDiv.appendChild(pageNumberlabel);
    pagesDiv.appendChild(nextPageBtn);
    const BackDiv = document.createElement('div');
    BackDiv.appendChild(backBtn)
    BackDiv.className = 'pages-div';
    document.getElementById('starships-name').appendChild(pageWrapper)
    pageWrapper.appendChild(pagesDiv);
    pageWrapper.appendChild(BackDiv)

}


function PrvPageAction() {
    if (state.page <= 1) {
        return
    }
    state.page = state.page - 1;
    buildSecondPage()
}

function NextPageAction() {
    if (state.page + 1 > state.pages) {
        return
    }
    state.page = state.page + 1;
    buildSecondPage()
}


async function iterMovies(moviesList) {
    let list = []
    for (let url of moviesList) {
        const json = await getData(url);
        console.log(json.title);
        list.push(json.title);
    }
    return list;
}

// فعالیت دکمه نام های starship ها را مشخص میکند
function ShipNameBtnAction(evt, starshipInfo) {
    document.querySelectorAll(".activated").forEach(el => el.classList.remove('activated'));
    evt.target.classList.add("activated");
    const rightCol = document.getElementById('starship-data');
    rightCol.innerHTML = '';
    Object.entries(starshipInfo).map(async ([key, value]) => {
        if (key == 'model' || key == 'manufacturer' || key == 'crew' || key == 'passengers' || key == 'films') {
            const itemDiv = document.createElement('div');
            itemDiv.className = "item-div";
            rightCol.appendChild(itemDiv);
            const keySpan = document.createElement('span');
            keySpan.className = 'key-span';
            const valSpan = document.createElement('span');
            valSpan.className = 'val-span';
            itemDiv.appendChild(keySpan);
            itemDiv.appendChild(valSpan);
            keySpan.innerText = key + ':';
            if (key == 'films') {
                const list = await iterMovies(value);
                console.log(list)
                for (const el of list) {
                    const div = document.createElement('div');
                    div.innerText = el;
                    console.log(el)
                    valSpan.appendChild(div);
                }
                return
            }
            valSpan.innerText = value + "";
        }
    });
}

// ساخت page دوم
function buildSecondPage() {
    const data = paging(state.querySet, state.page, state.rows);
    console.log('Data:', data);
    const myList = data.querySet;
    state.pages = data.pages;
    var wrapper = document.getElementById('content');
    wrapper.innerHTML = '';
    const header = document.createElement('header');
    header.id = "title";
    header.innerText = "Starships";
    wrapper.appendChild(header);
    const leftColumn = document.createElement("div");
    leftColumn.id = 'starships-name';
    const rightColumn = document.createElement("div");
    rightColumn.id = 'starship-data';
    const columnsContainer = document.createElement("div");
    columnsContainer.appendChild(leftColumn);
    columnsContainer.appendChild(rightColumn);
    columnsContainer.id = 'all-column';
    wrapper.appendChild(columnsContainer);
    const ul = document.createElement('ul');
    for (let e of myList) {
        const shipNameBtn = document.createElement("button");
        shipNameBtn.innerText = e.name + ""
        shipNameBtn.className = 'starships-name-btn';
        shipNameBtn.onclick = (evt) => ShipNameBtnAction(evt, e);
        console.log(e.name)
        const li = document.createElement("li");
        li.className = 'starship-list'
        li.appendChild(shipNameBtn);
        ul.appendChild(li);
        leftColumn.appendChild(ul)
    }
    pageButtons();
}

//فعالیت دکمه starship در صفحه اول
async function StarshipBtnَAction(js) {
    let starshipUrls = js.starships;
    const starshipsOfAMovie = []
    for (let urlKey of starshipUrls) {
        const response = await fetch(`${urlKey}`);
        const ja = await response.json();
        starshipsOfAMovie.push(ja);
    }
    state.querySet = starshipsOfAMovie
    buildSecondPage()
}

// ساختار page اول
async function buildFirstPage() {
    ids = [4, 5, 6, 1, 2, 3];
    Contents = []
    wrapper = document.getElementById('content');
    state.page = 1;
    wrapper.innerHTML = '';
    const header = document.createElement('header');
    header.id = "title";
    header.innerText = "Movies";
    wrapper.appendChild(header);
    const ul = document.createElement('ul');
    wrapper.appendChild(ul);
    for (let i of ids) {
        let json = await getData(`https://swapi.dev/api/films/${i}`);
        Contents[i] = json;
        let title = json.title;
        let epId = json.episode_id;
        let date = json.release_date;
        const str = title + "       " + epId + "       " + date;
        const p = document.createElement("pre");
        const node = document.createTextNode(str);
        p.appendChild(node);
        const starshipButton = document.createElement("button");
        starshipButton.innerText = "Starship";
        starshipButton.className = "Starshipbutton"
        starshipButton.onclick = () => StarshipBtnَAction(json)
        const div = document.createElement("div");
        div.className = 'movie-divs';
        const mydiv = document.createElement("div");
        mydiv.className = 'mydiv';
        mydiv.appendChild(starshipButton);
        div.appendChild(p);
        div.appendChild(mydiv);
        const li = document.createElement("li");
        li.appendChild(div);
        ul.id = 'movies-list'
        ul.appendChild(li);
    }
}

buildFirstPage();

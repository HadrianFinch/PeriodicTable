const sizeModifier = 54;

var searchButton = null;

const popup = 
{
    main: f("#popup"),
    name: f("#popup > h1"),
    categoryGroup: f("#popup > b"),
    description: f("#popup > p"),
    atomicMass: f("#popup > ul > li.atomicMass"),
    density: f("#popup > ul > li.density"),
    meltingPoint: f("#popup > ul > li.meltingPoint"),
    boilingPoint: f("#popup > ul > li.boilingPoint"),
    electronConfig: f("#popup > ul > li.electronConfig")
};


const elementHtmlElements = [];

function FillPopup(element)
{
    popup.main.classList.remove(...popup.main.classList);

    popup.main.classList.add(element.block + "_block");
    popup.main.classList.add((element.category + "_category").replaceAll(" ", "_"));

    popup.name.innerHTML = `${element.name} (${element.symbol})`;
    popup.categoryGroup.innerHTML = `Category: ${element.category}, Series: ${element.group}, Block: ${element.block}`;
    
    f.DeleteAllChildren(popup.description);
    popup.description.innerHTML = element.summary;
    popup.atomicMass.innerHTML = "<b>Atomic mass:</b> " + element.atomic_mass;
    popup.density.innerHTML = "<b>Density:</b> " + element.density + " g/ml";
    popup.meltingPoint.innerHTML = "<b>Melting Point:</b> " + element.melt + " ºC";
    popup.boilingPoint.innerHTML = "<b>Boiling Point:</b> " + element.boil + " ºC";
    popup.electronConfig.innerHTML = "<b>Electron Configuration:</b> " + element.electron_configuration;
}

function CreateElemmentHtml(parent, element)
{
    const cell = parent.f.NewChild("div", ["cell", "shadow", element.block + "_block", (element.category + "_category").replaceAll(" ", "_")]);

    cell.f.NewChild("p", ["atomicNumber"]).f.set(element.number);
    cell.f.NewChild("h1", ["symbolName"]).f.set(element.symbol);
    cell.f.NewChild("p", ["atomicMass"]).f.set(parseFloat(element.atomic_mass).toFixed(2));
    cell.style.left = (element.xpos - 1) * sizeModifier + "pt";
    cell.style.top = (element.ypos - 1) * sizeModifier + "pt";

    cell.ClickTrigger = () => {
        elementHtmlElements.forEach(element => {
            element.classList.remove("selected");
        });

        cell.classList.add("selected");
        FillPopup(element);
    }
    cell.f.on("click", () => {
        searchButton.classList.remove("selected");
        cell.ClickTrigger();
    });


    elementHtmlElements.push(cell);
}

function CreateCustomElementHtml(parent, element, classes, callback)
{
    const cell = parent.f.NewChild("div", ["cell", "shadow", ...classes]);
    
    cell.f.NewChild("p", ["atomicNumber"]).f.set(element.number);
    cell.f.NewChild("h1", ["symbolName"]).f.set(element.symbol);
    cell.f.NewChild("p", ["atomicMass"]).f.set(element.atomicMass);
    cell.style.left = (element.xpos - 1) * sizeModifier + "pt";
    cell.style.top = (element.ypos - 1) * sizeModifier + "pt";
    
    cell.f.on("click", () => {
        callback(cell);
    });
    
    // elementHtmlElements.push(cell);
    return cell;
}

(() => {
    const parent = f("#periodicTable");
    const searchDb = new Array(periodicTableData.elements.length);
    
    for (let index = 0; index < periodicTableData.elements.length; index++)
    {
        const element = periodicTableData.elements[index];
        CreateElemmentHtml(parent, element);
        
        const searchElement = {
            type: "element",
            weight: 0,
            name: element.name,
            data: {
                symbol: element.symbol,
                index: index
            }
        };
        searchDb[index] = searchElement;
    }


    searchButton = CreateCustomElementHtml(parent, {
        symbol: '',
        number: '<i class="fa-solid fa-magnifying-glass"></i> Search',
        atomicMass: '',
        xpos: 13,
        ypos: 1
    },["searchButton", "nonElemental"], (cell) => {
        elementHtmlElements.forEach(element => {
            element.classList.remove("selected");
        });

        // popup.main.classList.remove(...popup.main.classList);

        // popup.main.classList.add("filterButton");

        // popup.name.innerHTML = `Filter Options`;
        // popup.categoryGroup.innerHTML = `0 filters selected`;
        
        // f.DeleteAllChildren(popup.description);
        // popup.description.innerHTML = element.summary;
        // popup.atomicMass.innerHTML = "<b>Atomic mass:</b> " + element.atomic_mass;
        // popup.density.innerHTML = "<b>Density:</b> " + element.density + " g/ml";
        // popup.meltingPoint.innerHTML = "<b>Melting Point:</b> " + element.melt + " ºC";
        // popup.boilingPoint.innerHTML = "<b>Boiling Point:</b> " + element.boil + " ºC";
        // popup.electronConfig.innerHTML = "<b>Electron Configuration:</b> " + element.electron_configuration;

        cell.classList.add("selected");
    });
    searchButton.style.width = (54 * 2) - (54 - 35) + "pt"; 

    const searchH1 = f(".searchButton > h1");
    const searchInput = searchH1.f.NewChild("input");
    searchInput.type = "text";
    searchInput.placeholder = "name or symbol"

    searchInput.f.on("input", () => {
        const results = Search.Search(searchDb, {q: searchInput.value});
        if (results.length > 0)
        {
            elementHtmlElements[results[0].data.index].ClickTrigger();    
        }

        searchButton.classList.add("selected");
    });

    searchInput.f.on("keypress", (e) => {
        if ((e.key === "Enter") || (e.key === "esc"))
        {
            // Cancel the default action, if needed
            e.preventDefault();

            searchInput.blur();
            
            searchButton.classList.remove("selected");
            searchInput.value = "";
        }
    });
    
})();
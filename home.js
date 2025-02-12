class SystemElement {
  constructor(id) {
      this.id = id;
      //this.name = "System " + id;
    };

    
    setup() {
        let systemsContainer = document.getElementById("systemsContainer");

        const systemElement = document.createElement("div");
        systemElement.classList.add("systemElement");
        systemElement.id = "system-" + this.id;
        systemsContainer.appendChild(systemElement);

        const systemName = document.createElement("p");
        systemName.classList.add("systemName");
        systemName.textContent = "System " + this.id;
        systemElement.appendChild(systemName);

        const systemFeatures = document.createElement("div");
        systemFeatures.classList.add("systemFeatures");
        systemElement.appendChild(systemFeatures);

        const systemControls = document.createElement("div");
        systemControls.classList.add("systemControls");
        systemFeatures.appendChild(systemControls);

        systemName.onclick = () => {
          if (systemFeatures.classList.contains("systemFeaturesShow")) {
            systemFeatures.classList.remove("systemFeaturesShow");
          } else {
            systemFeatures.classList.add("systemFeaturesShow");
          }
        };
        

        let renameFunction = (e) => {
            let parentContainer = e.target.parentElement;
            let textBox = parentContainer.children[0];
            let systemElement = document.getElementById("system-" + this.id);
            let systemName = systemElement.children[0];
            systemName.textContent = textBox.value;
        };

        let deleteFunction = (e) => {
            let systemElement = document.getElementById("system-" + this.id);
            systemElement.remove();
        };

        this.createControlsTextInput(systemControls, "Rename", "System " + this.id, renameFunction);
        this.createButton(systemControls, "Delete", deleteFunction);
        this.createInfoBox(systemFeatures, "System Info", [this.id, "particles", "boom"]);
        
        // systemsContainer.onscroll = () => {
        //     scrollFade(systemsContainer);
        // };

        // function scrollFade(element) {
        //     let rect = element.getBoundingClientRect();
        //     let topElement = document.elementFromPoint(
        //       rect.left + parent.clientLeft,
        //       rect.top + parent.clientTop
        //     );

        //     let parent = element.parentElement;
        //     let distanceToTop = systemElement.pageYOffset + element.getBoundingClientRect().top;
        //     let elementHeight = element.offsetHeight;
        //     let scrollTop = element.offsetTop - parent.scrollTop;

        //     console.log(distanceToTop, elementHeight, scrollTop);

        //     let opacity = 1

        //     if (scrollTop > distanceToTop) {
        //       opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
        //     }

        //     if (opacity >= 0) {
        //       element.style.opacity = opacity;
        //     } 

        // }
    };

    createControlsTextInput(controlsContainer, buttonText, initalVal, submitButtonFunction) {
        let propertyInputContainer = document.createElement("div");
        propertyInputContainer.classList.add("homeTextInput");
        controlsContainer.appendChild(propertyInputContainer);

        let propertyInputBox = document.createElement("input");
        propertyInputBox.type = "text";
        propertyInputBox.classList.add("homeControlsInputBox");
        propertyInputContainer.appendChild(propertyInputBox);

        let propertyInputButton = document.createElement("button");
        propertyInputButton.textContent = buttonText;
        propertyInputBox.classList.add("controlsInputButton");
        propertyInputContainer.appendChild(propertyInputButton);

        propertyInputBox.value = initalVal;
        propertyInputButton.onclick = submitButtonFunction;
    };

    createButton(parent, title, clickFunction) {
        const button = document.createElement("button");
        button.innerHTML = title;
        button.onclick = clickFunction;
        parent.appendChild(button);
    };

    createInfoBox(parent, title, values) {
        const infoBox = document.createElement("div");
        infoBox.classList.add("infoBox");
        parent.appendChild(infoBox);

        const titleElement = document.createElement("div");
        titleElement.classList.add("infoBoxTitle");
        titleElement.textContent = title;
        infoBox.appendChild(titleElement);

        const valuesContainer = document.createElement("div");
        valuesContainer.classList.add("valuesContainer");
        infoBox.appendChild(valuesContainer);

        for (let i = 0; i < values.length; i++) {
            const valueElement = document.createElement("div");
            valueElement.classList.add("infoBoxValue");
            valueElement.textContent = values[i];
            valuesContainer.appendChild(valueElement);
        }

        titleElement.onclick = () => {
            if (valuesContainer.classList.contains("valuesContainerShow")) {
                valuesContainer.classList.remove("valuesContainerShow");
            } else {
                valuesContainer.classList.add("valuesContainerShow");
            };
        };
    };
};

sysList = [];

let createButton = document.getElementById("systemCreateButton");

createButton.onmousedown = function () {
    createButton.src = "images/addSystemClicked.png";
};
createButton.onmouseup = function () {
    createButton.src = "images/addSystem.png";
};
createButton.onmouseleave = function () {
    createButton.src = "images/addSystem.png";
};

createButton.onclick = function () {
    let newSystem = new SystemElement(sysList.length);
    newSystem.setup();
    sysList.push(sysList.length+1);
};



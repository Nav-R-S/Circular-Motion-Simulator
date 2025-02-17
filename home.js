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

        

        // Usage example
        //const container = document.getElementById("scrollable-div");
        systemsContainer.addEventListener("scroll", () => {
            scrollFade(systemsContainer);
        });

        function scrollFade(container) {

            function getEdgeElements(container) {
                const children = Array.from(container.children);
                let top = null;
                let minDistanceFromTop = Infinity;

                let bottom = null;
                let minDistanceFromBottom = Infinity;

                children.forEach((child) => {
                    const rect = child.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    let containerRectTop = containerRect.top;
                    let topDist = Math.abs((rect.top + rect.height / 2) - (containerRectTop));

                    let containerRectBottom = containerRect.bottom;
                    let bottomDist = Math.abs((rect.top + rect.height / 2) - (containerRectBottom));

                    if (topDist < minDistanceFromTop) {
                        minDistanceFromTop = topDist;
                        top = child;
                    };

                    if (bottomDist < minDistanceFromBottom) {
                        minDistanceFromBottom = bottomDist;
                        bottom = child;
                    };
                });
                return [top, bottom];
            };

            // redo function dec
            let containerRect = container.getBoundingClientRect();
            let edgeElements = getEdgeElements(container);
            
            let topElement = edgeElements[0];
            let bottomElement = edgeElements[1];
            
            let topElementRect = topElement.getBoundingClientRect();
            let bottomElementRect = bottomElement.getBoundingClientRect();

            Array.from(container.children).forEach(child => {
                child.children[0].style.background = "rgb(74, 78, 105)";
                child.style.opacity = 1;
            });//resets opacity of all elements

            // let topOpacity = 1 - (containerRect.top - topElementRect.top) / topElementRect.height;

            // let topOpacity = 1 - Math.pow(Math.max(0, Math.min(t, 1)), 2); // Quadratic easing

            // let bottomOpacity = 1 - (bottomElementRect.bottom - containerRect.bottom) / bottomElementRect.height;

            // let bottomOpacity = 1 - Math.pow(Math.max(0, Math.min(b, 1)), 2); // Quadratic easing

            // topElement.style.opacity = topOpacity;
            // bottomElement.style.opacity = bottomOpacity;

            let topPercent = ((containerRect.top - topElementRect.top) / topElementRect.height) * 100;

            if (topPercent > 0) {
                topElement.children[0].style.background = `linear-gradient(to bottom, rgba(74, 78, 105, 0) ${topPercent}%, rgba(74, 78, 105, 1))`;
            };

            let bottomPercent = (1 - (bottomElementRect.bottom - containerRect.bottom) / bottomElementRect.height) * 100;
            console.log(bottomPercent)
            if (bottomPercent > 0) {
                bottomElement.children[0].style.background = `linear-gradient(to bottom, rgba(74, 78, 105, 1) ${(bottomPercent)}%, rgba(74, 78, 105, 0)) `;
            }
        }
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



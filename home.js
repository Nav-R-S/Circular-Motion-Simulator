class SystemElement {
  constructor(id) {
      this.id = id;
      //this.name = "System " + id;
    }
    
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

        const systemControls = document.createElement("div");
        systemControls.classList.add("systemControls");
        systemElement.appendChild(systemControls);

        let renameFunction = (e) => {
            let parentContainer = e.target.parentElement;
            let textBox = parentContainer.children[0];
            let systemElement = document.getElementById("system-" + this.id);
            let systemName = systemElement.children[0];
            systemName.textContent = textBox.value;
        }

        let deleteFunction = (e) => {
            let systemElement = document.getElementById("system-" + this.id);
            systemElement.remove();
        }

        this.createControlsTextInput(systemControls, "Rename", "System " + this.id, renameFunction);
        this.createButton(systemControls, "Delete", deleteFunction);
        this.createInfoBox(systemElement, "System Info", [this.id, "particles", "boom"]);

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
    }

    createButton(parent, title, clickFunction) {
        const button = document.createElement("button");
        button.innerHTML = title;
        button.onclick = clickFunction;
        parent.appendChild(button);
    }

    createInfoBox(parent, title, values) {
        const infoBox = document.createElement("div");
        infoBox.classList.add("infoBox");
        parent.appendChild(infoBox);

        const titleElement = document.createElement("p");
        titleElement.textContent = title;
        infoBox.appendChild(titleElement);

        for (let i = 0; i < values.length; i++) {
            const valueElement = document.createElement("p");
            valueElement.textContent = values[i];
            infoBox.appendChild(valueElement);
        }
    }
}

sys1 = new SystemElement(1);
sys1.setup();
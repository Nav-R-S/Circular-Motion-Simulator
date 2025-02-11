class SystemElement {
  constructor(id) {
      this.id = id;
      this.name = "System " + id;
    }
    
    setup() {
        let systemsContainer = document.getElementById("systemsContainer");

        const systemElement = document.createElement("div");
        systemElement.id = "system " + this.id;
        systemsContainer.appendChild(systemElement);

        const systemName = document.createElement("p");
        systemName.innerHTML = this.name;
        systemElement.appendChild(systemName);

        const systemControls = document.createElement("div");
        systemElement.appendChild(systemControls);

        renameFunction = () => {
            this.name = 
        };

    };

    createButton(parent, title, clickFunction) {
        const button = document.createElement("div");
        button.innerHTML = title;
        button.onclick = clickFunction;
        parent.appendChild(button);
    }
}
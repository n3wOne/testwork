class Table {
    constructor(data) {
        this.createTable();
        this.data = data;
        this.treeData = null;
        this.sort = false
        this.init();
    }

    createTable() {
        this.table = document.createElement("table");
        this.table.classList.add("account");
        document.getElementById("main").append(this.table);
    }

    init() {
        this.prepareTableHead();
        this.createTree();
    }

    toggleSort = () => {
        document.getElementById("main").removeChild(this.table);
        this.createTable();
        this.sort = !this.sort;
        this.init();
        this.render();
    };

    findChildren = item => {
        const { id } = item;
        let children = [];
        data.forEach(i => {
            if (i.parentId === id) {
                children.push(i);
                return this.findChildren(i);
            }
        });
        if (children.length > 0) {
            item.children = children;
        }
        return item;
    };

    createTree() {
        const data = [...this.data];
        if (this.sort) {
            data.sort((a, b) => {
                return b.isActive - a.isActive;
            });
        }
        return (this.treeData = data
            .filter(item => item.parentId === 0)
            .map(item => this.findChildren(item)));
    }

    prepareTableHead() {
        const tableHead = document.createElement("thead");
        Object.keys(this.data[0]).forEach(key => {
            if (key === "children") return;
            const th = document.createElement("th");
            th.innerHTML = key;
            if (key === "isActive") {
                th.addEventListener("click", this.toggleSort);
                th.classList.add(this.sort ? "sort-down" : "sort-up");
                th.classList.add("sortable");
            }
            tableHead.append(th);
        });
        this.table.append(tableHead);
    }

    handleTrClick = function(id) {
        const tableRow = document.getElementById(id);
        tableRow.classList.toggle("expanded");
        var content = document.querySelectorAll(`[data-parent-id="${id}"]`);
        content.forEach(elem => {
            elem.classList.toggle("hidden");
        });
    };

    createTableRow = element => {
        const tableRow = document.createElement("tr");
        const { id, parentId, children } = element;
        this.table.append(tableRow);
        tableRow.id = id;

        if (children?.length > 0) {
            tableRow.classList.add("collapsible");
            tableRow.addEventListener("click", () => this.handleTrClick(id));
        }
        if (parentId !== 0) {
            tableRow.dataset.parentId = parentId;
            tableRow.classList.add("hidden");
        }

        Object.entries(element).forEach(([key, value]) => {
            if (key === "children") {
                value.forEach(children => this.createTableRow(children));
                return;
            }
            const tableCell = document.createElement("td");
            tableCell.innerHTML = value;
            tableRow.append(tableCell);
        });
    };

    renderTable = () => this.treeData.forEach(item => this.createTableRow(item))

    render() {
        this.renderTable();
    }
}

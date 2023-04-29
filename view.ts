import { TextFileView } from "obsidian";
const { parse } = require("csv-parse/sync");

export const VIEW_TYPE_CSV = "csv-view";

export class CSVView extends TextFileView {
  csvData: Object[];

  // Get data from table and save on CSV
  getViewData() {
    if (this.csvData.length > 0) {
      return [
        Object.keys(this.csvData[0]),
        ...this.csvData.map(row => Object.values(row))
      ]
       .map(e => e.join(",")) 
       .join('\n');
    } else return "";
  }

  setViewData(data: string, clear: boolean) {
    this.csvData = this.loadCSVData(data);
    this.refresh();
  }

  clear() {
    this.csvData = [];
  }

  async onOpen() {
    this.clear();    
  }

  async onClose() {
    this.contentEl.empty();
  }

  loadCSVData(data: string) {
    return parse(data.trim(), {
      relax_quotes: true,
           
      ltrim: true,
      rtrim: true,
      delimiter: ',',
      columns: true,
      skip_empty_lines: true
    });
  }

  refresh() {
    this.contentEl.empty();

    if (this.csvData.length > 0) {
      const csvTable = document.createElement('table');
      const tableBody = csvTable.createEl("tbody");

      const rowHead = tableBody.createEl("tr");
      Object.keys(this.csvData[0]).forEach(val => {
        rowHead.createEl("th", { text: val });
      });

      this.csvData.forEach(row => {
        const rowEl = tableBody.createEl("tr");
        Object.values(row).forEach(val => {
          rowEl.createEl("td", { text: val });
        });
      });

      this.contentEl.appendChild(csvTable);
    } else {
        const noContentEl = document.createElement('p');
        noContentEl.textContent = "<no-content>"
        this.contentEl.appendChild(noContentEl);
    }

  }

  getViewType() {
    return VIEW_TYPE_CSV;
  }
}

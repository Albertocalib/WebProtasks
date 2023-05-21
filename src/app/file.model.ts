import {Task} from "./task.model";
import {Board} from "./board.model";

export interface File {
    id?: number;
    name: string;
    type: string;
    content: string;
    task?:Task;
    board_ids?:Board[]
}

export class FileExtensions{
  EXTENSIONS_WORD: Set<string> = new Set(['docx', 'docm', 'dotx', 'dotm', 'odt', 'ott', 'txt']);
  EXTENSIONS_EXCEL: Set<string> = new Set(['xlsx', 'xls', 'xlsm', 'xlsb', '.xltx', 'xltm', 'xlt', 'csv']);
  EXTENSIONS_IMAGES: Set<string> = new Set(['jpg', 'jpeg', 'png', 'svg', 'img', 'heic']);
}

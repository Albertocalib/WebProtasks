export enum Priority {
  NO_PRIORITY = "NO_PRIORITY",
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT"

}

interface PriorityProperties {
  printableName: string;
  color: string;
  index: number;
  priority:Priority;
}

const priorityProperties: Record<Priority, PriorityProperties> = {
  [Priority.NO_PRIORITY]: {
    printableName: "No Priority",
    color: "rgba(0, 0, 0, 0)",
    index: 0,
    priority:Priority.NO_PRIORITY
  },
  [Priority.LOW]: {
    printableName: "Low",
    color: "gray",
    index: 1,
    priority:Priority.LOW
  },
  [Priority.NORMAL]: {
    printableName: "Normal",
    color: 'green',
    index: 2,
    priority: Priority.NORMAL
  },
  [Priority.HIGH]: {
    printableName: "High",
    color: 'yellow',
    index: 3,
    priority: Priority.HIGH
  },
  [Priority.URGENT]: {
    printableName: "Urgent",
    color: 'red',
    index: 4,
    priority: Priority.URGENT
  }
};

export function getPriorityIndex(priority: Priority): number {
  return priorityProperties[priority].index;
}
export function getPriorityColor(priority:Priority): string {
  return priorityProperties[priority].color;
}
export function getPriorityPrintableName(priority:Priority): string {
  return priorityProperties[priority].printableName;
}

export function getPriorityColors(): string[] {
  return Object.values(priorityProperties).map(p => p.color).filter(c => c !== null) as string[];
}

export function getPriorityNames(): string[] {
  return Object.values(priorityProperties).map(p => p.printableName);
}


/**
 * Employee Manager - View, search, and filter employees
 *
 * Provides a simulated employee management interface with search and filtering capabilities.
 * Demonstrates how Pi extensions can interact with data management systems.
 *
 * Usage: pi -e extensions/employee-manager.ts
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { applyExtensionDefaults } from "./themeMap.ts";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

// Sample employee data
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  hireDate: string;
  salary: number;
}

const sampleEmployees: Employee[] = [
  {
    id: "emp-001",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@company.com",
    phone: "+33 1 23 45 67 89",
    position: "Développeur Frontend",
    department: "Développement",
    status: "active",
    hireDate: "2023-01-15",
    salary: 45000
  },
  {
    id: "emp-002",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@company.com",
    phone: "+33 1 23 45 67 90",
    position: "Chef de Projet",
    department: "Management",
    status: "active",
    hireDate: "2022-03-22",
    salary: 55000
  },
  {
    id: "emp-003",
    firstName: "Pierre",
    lastName: "Durand",
    email: "pierre.durand@company.com",
    phone: "+33 1 23 45 67 91",
    position: "Analyste QA",
    department: "Développement",
    status: "pending",
    hireDate: "2024-02-10",
    salary: 40000
  },
  {
    id: "emp-004",
    firstName: "Sophie",
    lastName: "Leroy",
    email: "sophie.leroy@company.com",
    phone: "+33 1 23 45 67 92",
    position: "Designer UI/UX",
    department: "Design",
    status: "active",
    hireDate: "2023-07-05",
    salary: 48000
  },
  {
    id: "emp-005",
    firstName: "Thomas",
    lastName: "Moreau",
    email: "thomas.moreau@company.com",
    phone: "+33 1 23 45 67 93",
    position: "Architecte Système",
    department: "Développement",
    status: "inactive",
    hireDate: "2021-11-30",
    salary: 75000
  },
  {
    id: "emp-006",
    firstName: "Claire",
    lastName: "Simon",
    email: "claire.simon@company.com",
    phone: "+33 1 23 45 67 94",
    position: "Spécialiste RH",
    department: "Ressources Humaines",
    status: "active",
    hireDate: "2023-05-18",
    salary: 52000
  },
  {
    id: "emp-007",
    firstName: "Luc",
    lastName: "Bertrand",
    email: "luc.bertrand@company.com",
    phone: "+33 1 23 45 67 95",
    position: "Technicien Support",
    department: "Support",
    status: "active",
    hireDate: "2024-01-12",
    salary: 38000
  },
  {
    id: "emp-008",
    firstName: "Émilie",
    lastName: "Petit",
    email: "emilie.petit@company.com",
    phone: "+33 1 23 45 67 96",
    position: "Comptable",
    department: "Finance",
    status: "active",
    hireDate: "2022-09-03",
    salary: 46000
  }
];

// State management
let searchTerm = "";
let departmentFilter = "all";
let statusFilter = "all";
let currentPage = 1;
const itemsPerPage = 5;

// Helper functions
function filterEmployees(employees: Employee[]): Employee[] {
  return employees.filter(employee => {
    const matchesSearch = searchTerm === "" || 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
}

function getDepartments(employees: Employee[]): string[] {
  const departments = new Set(employees.map(emp => emp.department));
  return Array.from(departments).sort();
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Actif';
    case 'inactive': return 'Inactif';
    case 'pending': return 'En attente';
    default: return status;
  }
}

function getStatusColor(status: string, theme: any): string {
  switch (status) {
    case 'active': return theme.fg("green", getStatusLabel(status));
    case 'inactive': return theme.fg("red", getStatusLabel(status));
    case 'pending': return theme.fg("yellow", getStatusLabel(status));
    default: return getStatusLabel(status);
  }
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    applyExtensionDefaults(import.meta.url, ctx);
    
    // Add a command to manage employees
    ctx.commands.registerCommand({
      id: "employee-list",
      description: "Afficher la liste des employés avec recherche et filtres",
      handler: async () => {
        // Reset to first page when opening
        currentPage = 1;
        
        // Create a simple UI for employee management
        const panel = ctx.ui.createPanel({
          title: "Gestion des Employés",
          width: "100%",
          height: "80%",
          onClose: () => {}
        });
        
        panel.setContent((tui, theme) => {
          const filteredEmployees = filterEmployees(sampleEmployees);
          const departments = getDepartments(sampleEmployees);
          
          // Calculate pagination
          const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, filteredEmployees.length);
          const currentEmployees = filteredEmployees.slice(startIndex, endIndex);
          
          // Header with search and filters
          let content = `${theme.fg("bold", "Recherche:")} ${searchTerm || "(vide)"} | `;
          content += `${theme.fg("bold", "Département:")} ${departmentFilter === "all" ? "Tous" : departmentFilter} | `;
          content += `${theme.fg("bold", "Statut:")} ${statusFilter === "all" ? "Tous" : getStatusLabel(statusFilter)}\n`;
          content += `${theme.fg("dim", `Affichage ${startIndex + 1}-${endIndex} de ${filteredEmployees.length} employés`)}\n\n`;
          
          // Table header
          content += theme.fg("bold", "Nom                  Email                      Département      Poste               Statut      \n");
          content += theme.fg("dim", "──────────────────── ────────────────────────── ──────────────── ─────────────────── ───────────\n");
          
          // Table rows
          if (currentEmployees.length === 0) {
            content += "\n" + theme.fg("dim", "Aucun employé trouvé avec ces critères.") + "\n";
          } else {
            for (const employee of currentEmployees) {
              const fullName = `${employee.firstName} ${employee.lastName}`;
              const nameCol = fullName.padEnd(20).substring(0, 20);
              const emailCol = employee.email.padEnd(26).substring(0, 26);
              const deptCol = employee.department.padEnd(16).substring(0, 16);
              const positionCol = employee.position.padEnd(19).substring(0, 19);
              const statusCol = getStatusColor(employee.status, theme);
              
              content += `${nameCol} ${emailCol} ${deptCol} ${positionCol} ${statusCol}\n`;
            }
          }
          
          // Pagination controls
          content += "\n";
          if (totalPages > 1) {
            let pagination = "Pages: ";
            for (let i = 1; i <= totalPages; i++) {
              if (i === currentPage) {
                pagination += theme.fg("bold", `[${i}] `);
              } else {
                pagination += `[${i}] `;
              }
            }
            content += pagination.trim() + "\n";
          }
          
          // Instructions
          content += `\n${theme.fg("dim", "Commandes: /search [terme], /filter-department [département], /filter-status [statut], /page [num], /reset")}`;
          
          return content;
        });
      }
    });
    
    // Add search command
    ctx.commands.registerCommand({
      id: "search",
      description: "Rechercher des employés par nom ou email",
      handler: async (args: string[]) => {
        searchTerm = args.join(" ");
        ctx.ui.showNotification(`Recherche mise à jour: "${searchTerm}"`, "info");
      }
    });
    
    // Add department filter command
    ctx.commands.registerCommand({
      id: "filter-department",
      description: "Filtrer par département",
      handler: async (args: string[]) => {
        const dept = args.join(" ");
        if (dept === "all" || dept === "") {
          departmentFilter = "all";
          ctx.ui.showNotification("Filtre département réinitialisé", "info");
        } else {
          departmentFilter = dept;
          ctx.ui.showNotification(`Filtre département: ${dept}`, "info");
        }
      }
    });
    
    // Add status filter command
    ctx.commands.registerCommand({
      id: "filter-status",
      description: "Filtrer par statut (active, inactive, pending)",
      handler: async (args: string[]) => {
        const status = args.join(" ").toLowerCase();
        if (status === "all" || status === "") {
          statusFilter = "all";
          ctx.ui.showNotification("Filtre statut réinitialisé", "info");
        } else if (["active", "inactive", "pending"].includes(status)) {
          statusFilter = status as any;
          ctx.ui.showNotification(`Filtre statut: ${getStatusLabel(status)}`, "info");
        } else {
          ctx.ui.showNotification("Statut invalide. Utilisez: active, inactive, pending, ou all", "error");
        }
      }
    });
    
    // Add pagination command
    ctx.commands.registerCommand({
      id: "page",
      description: "Aller à une page spécifique",
      handler: async (args: string[]) => {
        const pageNum = parseInt(args[0]);
        if (!isNaN(pageNum) && pageNum > 0) {
          const filteredEmployees = filterEmployees(sampleEmployees);
          const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
          if (pageNum <= totalPages) {
            currentPage = pageNum;
            ctx.ui.showNotification(`Page ${pageNum}/${totalPages}`, "info");
          } else {
            ctx.ui.showNotification(`Page ${pageNum} hors limites (max: ${totalPages})`, "error");
          }
        } else {
          ctx.ui.showNotification("Numéro de page invalide", "error");
        }
      }
    });
    
    // Add reset command
    ctx.commands.registerCommand({
      id: "reset",
      description: "Réinitialiser tous les filtres et la recherche",
      handler: async () => {
        searchTerm = "";
        departmentFilter = "all";
        statusFilter = "all";
        currentPage = 1;
        ctx.ui.showNotification("Filtres réinitialisés", "info");
      }
    });
    
    // Add a widget to show employee count in footer
    ctx.ui.setFooter((_tui, theme, _footerData) => ({
      dispose: () => {},
      invalidate() {},
      render(width: number): string[] {
        const activeCount = sampleEmployees.filter(e => e.status === 'active').length;
        const totalCount = sampleEmployees.length;
        
        const left = theme.fg("dim", ` Employés: ${activeCount}/${totalCount} actifs `);
        const right = theme.fg("dim", ` Page: ${currentPage} `);
        const pad = " ".repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(right)));
        
        return [truncateToWidth(left + pad + right, width)];
      },
    }));
    
    // Show welcome message
    ctx.ui.showNotification("Extension Employee Manager chargée. Tapez /employee-list pour commencer.", "info");
  });
}
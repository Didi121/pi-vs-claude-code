/**
 * Employee Editor - Edit employee information form
 *
 * Provides a form interface for editing employee details.
 * Demonstrates form handling, data binding, and API interaction in Pi extensions.
 *
 * Usage: pi -e extensions/employee-editor.ts
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { applyExtensionDefaults } from "./themeMap.ts";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

// Sample employee data (in a real app, this would come from an API)
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
  }
];

// Form state management
let currentEmployeeId: string | null = null;
let formData: Partial<Employee> = {};
let formErrors: Record<string, string> = {};
let isEditing = false;

// Helper functions
function findEmployee(id: string): Employee | undefined {
  return sampleEmployees.find(emp => emp.id === id);
}

function validateForm(data: Partial<Employee>): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "Le prénom est requis";
  }
  
  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Le nom est requis";
  }
  
  if (!data.email || data.email.trim() === "") {
    errors.email = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Format d'email invalide";
  }
  
  if (!data.position || data.position.trim() === "") {
    errors.position = "Le poste est requis";
  }
  
  if (!data.department || data.department.trim() === "") {
    errors.department = "Le département est requis";
  }
  
  if (!data.hireDate || data.hireDate.trim() === "") {
    errors.hireDate = "La date d'embauche est requise";
  }
  
  if (data.salary === undefined || data.salary <= 0) {
    errors.salary = "Le salaire doit être positif";
  }
  
  return errors;
}

function updateEmployee(id: string, updates: Partial<Employee>): boolean {
  const employeeIndex = sampleEmployees.findIndex(emp => emp.id === id);
  if (employeeIndex === -1) return false;
  
  sampleEmployees[employeeIndex] = { ...sampleEmployees[employeeIndex], ...updates };
  return true;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    applyExtensionDefaults(import.meta.url, ctx);
    
    // Add a command to edit an employee
    ctx.commands.registerCommand({
      id: "employee-edit",
      description: "Modifier les informations d'un employé",
      handler: async (args: string[]) => {
        const employeeId = args[0];
        if (!employeeId) {
          ctx.ui.showNotification("Veuillez spécifier un ID d'employé. Usage: /employee-edit [id]", "error");
          return;
        }
        
        const employee = findEmployee(employeeId);
        if (!employee) {
          ctx.ui.showNotification(`Employé avec ID ${employeeId} non trouvé`, "error");
          return;
        }
        
        // Load employee data into form
        currentEmployeeId = employeeId;
        formData = { ...employee };
        formErrors = {};
        isEditing = true;
        
        // Create the edit form panel
        const panel = ctx.ui.createPanel({
          title: `Modifier Employé - ${employee.firstName} ${employee.lastName}`,
          width: "100%",
          height: "80%",
          onClose: () => {
            isEditing = false;
            currentEmployeeId = null;
          }
        });
        
        panel.setContent((tui, theme) => {
          let content = `${theme.fg("bold", "Formulaire d'édition employé")}\n\n`;
          
          // Form fields
          content += `${theme.fg("bold", "Prénom:")} ${formData.firstName || ""}\n`;
          if (formErrors.firstName) {
            content += `${theme.fg("red", "  ✗ " + formErrors.firstName)}\n`;
          }
          
          content += `\n${theme.fg("bold", "Nom:")} ${formData.lastName || ""}\n`;
          if (formErrors.lastName) {
            content += `${theme.fg("red", "  ✗ " + formErrors.lastName)}\n`;
          }
          
          content += `\n${theme.fg("bold", "Email:")} ${formData.email || ""}\n`;
          if (formErrors.email) {
            content += `${theme.fg("red", "  ✗ " + formErrors.email)}\n`;
          }
          
          content += `\n${theme.fg("bold", "Téléphone:")} ${formData.phone || ""}\n`;
          
          content += `\n${theme.fg("bold", "Poste:")} ${formData.position || ""}\n`;
          if (formErrors.position) {
            content += `${theme.fg("red", "  ✗ " + formErrors.position)}\n`;
          }
          
          content += `\n${theme.fg("bold", "Département:")} ${formData.department || ""}\n`;
          if (formErrors.department) {
            content += `${theme.fg("red", "  ✗ " + formErrors.department)}\n`;
          }
          
          content += `\n${theme.fg("bold", "Statut:")} ${formData.status || "active"}\n`;
          
          content += `\n${theme.fg("bold", "Date d'embauche:")} ${formData.hireDate || ""}\n`;
          if (formErrors.hireDate) {
            content += `${theme.fg("red", "  ✗ " + formErrors.hireDate)}\n`;
          }
          
          content += `\n${theme.fg("bold", "Salaire:")} ${formData.salary || ""} €\n`;
          if (formErrors.salary) {
            content += `${theme.fg("red", "  ✗ " + formErrors.salary)}\n`;
          }
          
          // Buttons
          content += `\n${theme.fg("bold", "[/save]")} Enregistrer les modifications | ${theme.fg("bold", "[/cancel]")} Annuler\n`;
          
          // Instructions
          content += `\n${theme.fg("dim", "Modifiez les champs directement dans le terminal, puis tapez /save pour enregistrer ou /cancel pour annuler.")}`;
          
          return content;
        });
        
        ctx.ui.showNotification(`Formulaire de modification ouvert pour ${employee.firstName} ${employee.lastName}`, "info");
      }
    });
    
    // Add command to set form field values
    ctx.commands.registerCommand({
      id: "set-field",
      description: "Définir la valeur d'un champ du formulaire",
      handler: async (args: string[]) => {
        if (!isEditing || !currentEmployeeId) {
          ctx.ui.showNotification("Aucun formulaire d'édition actif", "error");
          return;
        }
        
        if (args.length < 2) {
          ctx.ui.showNotification("Usage: /set-field [nom_champ] [valeur]", "error");
          return;
        }
        
        const fieldName = args[0];
        const fieldValue = args.slice(1).join(" ");
        
        // Update the form field
        (formData as any)[fieldName] = fieldValue;
        
        // Clear error for this field if it existed
        if (formErrors[fieldName]) {
          delete formErrors[fieldName];
        }
        
        ctx.ui.showNotification(`Champ ${fieldName} mis à jour`, "info");
      }
    });
    
    // Add save command
    ctx.commands.registerCommand({
      id: "save",
      description: "Enregistrer les modifications de l'employé",
      handler: async () => {
        if (!isEditing || !currentEmployeeId) {
          ctx.ui.showNotification("Aucun formulaire d'édition actif", "error");
          return;
        }
        
        // Validate form
        formErrors = validateForm(formData);
        if (Object.keys(formErrors).length > 0) {
          ctx.ui.showNotification("Formulaire invalide. Veuillez corriger les erreurs.", "error");
          return;
        }
        
        // Save the employee data
        if (updateEmployee(currentEmployeeId, formData as Employee)) {
          ctx.ui.showNotification("Informations de l'employé mises à jour avec succès", "success");
          
          // Close the panel
          ctx.ui.closePanel();
          isEditing = false;
          currentEmployeeId = null;
        } else {
          ctx.ui.showNotification("Erreur lors de la mise à jour de l'employé", "error");
        }
      }
    });
    
    // Add cancel command
    ctx.commands.registerCommand({
      id: "cancel",
      description: "Annuler l'édition et fermer le formulaire",
      handler: async () => {
        if (!isEditing) {
          ctx.ui.showNotification("Aucun formulaire d'édition actif", "error");
          return;
        }
        
        // Reset form state
        formData = {};
        formErrors = {};
        isEditing = false;
        currentEmployeeId = null;
        
        // Close the panel
        ctx.ui.closePanel();
        ctx.ui.showNotification("Modification annulée", "info");
      }
    });
    
    // Add a widget to show current editing status
    ctx.ui.setFooter((_tui, theme, _footerData) => ({
      dispose: () => {},
      invalidate() {},
      render(width: number): string[] {
        let left = theme.fg("dim", " Employee Manager ");
        
        if (isEditing && currentEmployeeId) {
          const employee = findEmployee(currentEmployeeId);
          if (employee) {
            left = theme.fg("yellow", ` Édition: ${employee.firstName} ${employee.lastName} `);
          }
        }
        
        const right = theme.fg("dim", ` ${sampleEmployees.length} employés `);
        const pad = " ".repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(right)));
        
        return [truncateToWidth(left + pad + right, width)];
      },
    }));
    
    // Show welcome message
    ctx.ui.showNotification("Extension Employee Editor chargée. Tapez /employee-edit [id] pour modifier un employé.", "info");
  });
}
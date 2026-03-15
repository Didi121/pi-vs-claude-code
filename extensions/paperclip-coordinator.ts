import { registerTool, PiAgentEvent, PiAgentEventUnion, ExtensionAPI } from '@mariozechner/pi-coding-agent';
import { Type } from '@sinclair/typebox';

// Paperclip Coordinator Extension
// Integrates Paperclip task management with Pi Coding Agent extensions

let api: ExtensionAPI;

// Initialize on session start
export const onEvent = async (event: PiAgentEventUnion) => {
  if (event.type === 'session_start') {
    api = event.api;
    
    // Register tools for Paperclip integration
    registerTool({
      name: 'paperclip_list_tasks',
      description: 'List all Paperclip tasks assigned to this agent',
      parameters: Type.Object({}),
      handler: async () => {
        try {
          // Check if Paperclip environment variables are available
          const hasPaperclipEnv = process.env.PAPERCLIP_AGENT_ID && process.env.PAPERCLIP_COMPANY_ID && process.env.PAPERCLIP_API_KEY;
          
          if (!hasPaperclipEnv) {
            return {
              success: false,
              message: 'Paperclip environment variables not found. Please set PAPERCLIP_AGENT_ID, PAPERCLIP_COMPANY_ID, and PAPERCLIP_API_KEY.'
            };
          }
          
          // Mock implementation - in a real implementation this would call the Paperclip API
          return {
            success: true,
            tasks: [
              {
                id: 'task-1',
                title: 'Implement Paperclip integration',
                status: 'todo',
                priority: 'high',
                description: 'Integrate Paperclip task management with Pi Coding Agent'
              },
              {
                id: 'task-2',
                title: 'Review existing extensions',
                status: 'in_progress',
                priority: 'medium',
                description: 'Analyze existing Pi extensions for Paperclip compatibility'
              }
            ]
          };
        } catch (error) {
          return {
            success: false,
            message: `Error listing tasks: ${error.message}`
          };
        }
      }
    });
    
    registerTool({
      name: 'paperclip_create_task',
      description: 'Create a new task in Paperclip',
      parameters: Type.Object({
        title: Type.String({ description: 'Task title' }),
        description: Type.String({ description: 'Task description' }),
        priority: Type.Union([
          Type.Literal('critical'),
          Type.Literal('high'),
          Type.Literal('medium'),
          Type.Literal('low')
        ], { description: 'Task priority' })
      }),
      handler: async (params: { title: string; description: string; priority: string }) => {
        try {
          const hasPaperclipEnv = process.env.PAPERCLIP_AGENT_ID && process.env.PAPERCLIP_COMPANY_ID && process.env.PAPERCLIP_API_KEY;
          
          if (!hasPaperclipEnv) {
            return {
              success: false,
              message: 'Paperclip environment variables not found. Please set PAPERCLIP_AGENT_ID, PAPERCLIP_COMPANY_ID, and PAPERCLIP_API_KEY.'
            };
          }
          
          // Mock implementation - in a real implementation this would call the Paperclip API
          const taskId = `task-${Date.now()}`;
          
          return {
            success: true,
            taskId: taskId,
            message: `Created task ${params.title} with ID ${taskId}`
          };
        } catch (error) {
          return {
            success: false,
            message: `Error creating task: ${error.message}`
          };
        }
      }
    });
    
    registerTool({
      name: 'paperclip_update_task_status',
      description: 'Update the status of a Paperclip task',
      parameters: Type.Object({
        taskId: Type.String({ description: 'Task ID' }),
        status: Type.Union([
          Type.Literal('backlog'),
          Type.Literal('todo'),
          Type.Literal('in_progress'),
          Type.Literal('in_review'),
          Type.Literal('done'),
          Type.Literal('blocked'),
          Type.Literal('cancelled')
        ], { description: 'New task status' }),
        comment: Type.Optional(Type.String({ description: 'Comment explaining the status change' }))
      }),
      handler: async (params: { taskId: string; status: string; comment?: string }) => {
        try {
          const hasPaperclipEnv = process.env.PAPERCLIP_AGENT_ID && process.env.PAPERCLIP_COMPANY_ID && process.env.PAPERCLIP_API_KEY;
          
          if (!hasPaperclipEnv) {
            return {
              success: false,
              message: 'Paperclip environment variables not found. Please set PAPERCLIP_AGENT_ID, PAPERCLIP_COMPANY_ID, and PAPERCLIP_API_KEY.'
            };
          }
          
          // Mock implementation - in a real implementation this would call the Paperclip API
          return {
            success: true,
            message: `Updated task ${params.taskId} status to ${params.status}${params.comment ? ` with comment: ${params.comment}` : ''}`
          };
        } catch (error) {
          return {
            success: false,
            message: `Error updating task status: ${error.message}`
          };
        }
      }
    });
    
    api.notify.info('Paperclip Coordinator extension loaded');
  }
};
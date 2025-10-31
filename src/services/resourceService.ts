import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Resource } from '../types';
import { RESOURCES_SEED_DATA } from '../constants/seeds';

export const resourceService = {
  /**
   * Get all resources
   */
  async getResources(type?: 'libro' | 'articulo' | 'glosario' | 'plantilla'): Promise<Resource[]> {
    if (!isSupabaseConfigured()) {
      if (type) {
        return RESOURCES_SEED_DATA.filter((r) => r.type === type);
      }
      return RESOURCES_SEED_DATA;
    }

    try {
      let query = supabase.from('resources').select('*').order('created_at');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Resource[];
    } catch (err) {
      console.error('Error fetching resources:', err);
      return type ? RESOURCES_SEED_DATA.filter((r) => r.type === type) : RESOURCES_SEED_DATA;
    }
  },

  /**
   * Get books
   */
  async getBooks(): Promise<Resource[]> {
    return this.getResources('libro');
  },

  /**
   * Get articles
   */
  async getArticles(): Promise<Resource[]> {
    return this.getResources('articulo');
  },

  /**
   * Get glossary terms
   */
  async getGlossary(searchTerm?: string): Promise<Resource[]> {
    const glossary = await this.getResources('glosario');

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return glossary.filter(
        (item) =>
          item.term?.toLowerCase().includes(term) ||
          item.definition?.toLowerCase().includes(term)
      );
    }

    return glossary;
  },

  /**
   * Get templates
   */
  async getTemplates(): Promise<Resource[]> {
    return this.getResources('plantilla');
  },

  /**
   * Get resource by ID
   */
  async getResourceById(resourceId: string): Promise<Resource | null> {
    if (!isSupabaseConfigured()) {
      return RESOURCES_SEED_DATA.find((r) => r.id === resourceId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();

      if (error) throw error;
      return data as Resource;
    } catch (err) {
      console.error('Error fetching resource:', err);
      return null;
    }
  },

  /**
   * Search resources
   */
  async searchResources(query: string): Promise<Resource[]> {
    const allResources = await this.getResources();
    const searchLower = query.toLowerCase();

    return allResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.author?.toLowerCase().includes(searchLower) ||
        resource.term?.toLowerCase().includes(searchLower) ||
        resource.definition?.toLowerCase().includes(searchLower)
    );
  },
};

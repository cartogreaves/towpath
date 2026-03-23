export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PostType = 'ask' | 'offer'
export type PostVisibility = 'public' | 'friends'
export type BoatType = 'narrowboat' | 'widebeam' | 'cruiser' | 'dutch_barge' | 'tug' | 'butty' | 'other'
export type FriendshipStatus = 'pending' | 'accepted'
export type RoutePace = 'relaxed' | 'steady' | 'pushing'

export interface Database {
  public: {
    Tables: {
      navigations: {
        Row: {
          id: number
          name: string
          min_lng: number
          min_lat: number
          max_lng: number
          max_lat: number
          center_lng: number
          center_lat: number
        }
        Insert: never
        Update: never
      }
      profiles: {
        Row: {
          id: string
          handle: string
          boat_name: string | null
          boat_colour: string
          boat_type: BoatType
          is_cc: boolean
          bio: string | null
          whatsapp_number: string | null
          whatsapp_enabled: boolean
          avatar_url: string | null
          trust_score: number
          total_miles: number
          total_locks: number
          default_navigation_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at' | 'trust_score' | 'total_miles' | 'total_locks'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      boat_locations: {
        Row: {
          user_id: string
          location: unknown
          heading: number | null
          accuracy_m: number | null
          updated_at: string
        }
        Insert: Database['public']['Tables']['boat_locations']['Row']
        Update: Partial<Database['public']['Tables']['boat_locations']['Row']>
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: FriendshipStatus
          share_location: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['friendships']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['friendships']['Insert']>
      }
      events: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          location: unknown
          location_name: string | null
          canal_id: string | null
          starts_at: string
          ends_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      event_rsvps: {
        Row: {
          event_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['event_rsvps']['Row'], 'created_at'>
        Update: never
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          whatsapp_url: string | null
          creator_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['groups']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['groups']['Insert']>
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: Omit<Database['public']['Tables']['group_members']['Row'], 'joined_at'>
        Update: never
      }
      saved_routes: {
        Row: {
          id: string
          user_id: string
          name: string
          geometry: unknown
          pace: RoutePace
          total_miles: number | null
          total_locks: number | null
          estimated_days: number | null
          day_breakdown: Json | null
          shared: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['saved_routes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['saved_routes']['Insert']>
      }
      mooring_timers: {
        Row: {
          id: string
          user_id: string
          started_at: string
          location: unknown
          location_name: string | null
          notified_day_12: boolean
          notified_day_14: boolean
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['mooring_timers']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['mooring_timers']['Insert']>
      }
      cruising_log: {
        Row: {
          id: string
          user_id: string
          date: string
          miles: number | null
          locks_worked: number
          canal_id: string | null
          from_location: string | null
          to_location: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['cruising_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['cruising_log']['Insert']>
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          type: PostType
          title: string
          body: string | null
          location: unknown | null
          canal_id: string | null
          visibility: PostVisibility
          is_resolved: boolean
          created_at: string
          expires_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at' | 'is_resolved'>
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>
      }
    }
    Functions: {
      update_boat_location: {
        Args: {
          p_lat: number
          p_lng: number
          p_heading?: number
          p_accuracy?: number
        }
        Returns: void
      }
      search_infrastructure: {
        Args: { p_query: string }
        Returns: { id: number; sap_description: string; type: string; waterway_name: string; lng: number; lat: number }[]
      }
      canal_network_in_bbox: {
        Args: { p_lng1: number; p_lat1: number; p_lng2: number; p_lat2: number }
        Returns: { id: number; name: string; sapnavstatus: string; geojson: string }[]
      }
      infrastructure_in_bbox: {
        Args: {
          p_lng1: number; p_lat1: number; p_lng2: number; p_lat2: number
          p_type?: string
        }
        Returns: { id: number; sap_description: string; type: string; waterway_name: string; lng: number; lat: number }[]
      }
    }
    Enums: {
      boat_type: BoatType
      friendship_status: FriendshipStatus
      route_pace: RoutePace
      post_type: PostType
      post_visibility: PostVisibility
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type SavedRoute = Database['public']['Tables']['saved_routes']['Row']
export type MooringTimer = Database['public']['Tables']['mooring_timers']['Row']
export type CruisingLogEntry = Database['public']['Tables']['cruising_log']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']
export type BoatLocation = Database['public']['Tables']['boat_locations']['Row']

// Boat location with joined profile — returned by get_visible_boat_locations()
export interface BoatLocationWithProfile {
  user_id:     string
  handle:      string
  boat_name:   string | null
  boat_colour: string
  lat:         number
  lng:         number
  heading:     number | null
  updated_at:  string
  is_own:      boolean
}

// Saved route with GeoJSON geometry — returned by get_saved_routes_geojson()
export interface SavedRouteWithGeojson {
  id:          string
  name:        string
  description: string | null
  total_miles: number
  total_locks: number
  pace:        RoutePace
  geojson:     { type: 'LineString'; coordinates: [number, number][] } | null
}

// Community post with joined author fields
export interface CommunityPost {
  id: string
  author_id: string
  author_handle: string
  author_boat_name: string | null
  author_avatar_url: string | null
  type: PostType
  title: string
  body: string | null
  lat: number | null
  lng: number | null
  canal_id: string | null
  visibility: PostVisibility
  is_resolved: boolean
  created_at: string
  expires_at: string | null
}

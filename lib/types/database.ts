export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PoiType =
  | 'water_point'
  | 'mooring'
  | 'lock'
  | 'winding_hole'
  | 'waste_services'
  | 'pump_out'
  | 'pub'
  | 'shop'
  | 'boatyard'
  | 'fuel'
  | 'launderette'
  | 'post_office'

export type ServiceStatus = 'working' | 'issue_reported' | 'closed' | 'unknown'
export type PostType = 'ask' | 'offer'
export type PostVisibility = 'public' | 'friends'
export type BoatType = 'narrowboat' | 'widebeam' | 'cruiser' | 'dutch_barge' | 'tug' | 'butty' | 'other'
export type FriendshipStatus = 'pending' | 'accepted'
export type StoppageType = 'closure' | 'restriction' | 'maintenance' | 'emergency'
export type RoutePace = 'relaxed' | 'steady' | 'pushing'

export interface Database {
  public: {
    Tables: {
      canals: {
        Row: {
          id: string
          name: string
          alternate_names: string[] | null
          geometry: unknown
          length_mi: number | null
          navigation_authority: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['canals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['canals']['Insert']>
      }
      pois: {
        Row: {
          id: string
          name: string
          type: PoiType
          location: unknown
          canal_id: string | null
          mile_marker: number | null
          metadata: Json
          osm_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pois']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pois']['Insert']>
      }
      locks: {
        Row: {
          id: string
          poi_id: string
          rise_ft: number | null
          width_ft: number | null
          length_ft: number | null
          type: 'narrow' | 'wide' | 'broad' | null
          paired: boolean
          staircase: number
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['locks']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['locks']['Insert']>
      }
      stoppages: {
        Row: {
          id: string
          canal_id: string | null
          title: string
          description: string | null
          type: StoppageType
          start_point: unknown | null
          end_point: unknown | null
          affected_geometry: unknown | null
          starts_at: string | null
          ends_at: string | null
          source_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stoppages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stoppages']['Insert']>
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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
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
      status_reports: {
        Row: {
          id: string
          poi_id: string
          user_id: string
          status: ServiceStatus
          comment: string | null
          photos: string[] | null
          confirmation_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['status_reports']['Row'], 'id' | 'created_at' | 'confirmation_count'>
        Update: Partial<Database['public']['Tables']['status_reports']['Insert']>
      }
      report_confirmations: {
        Row: {
          report_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['report_confirmations']['Row'], 'created_at'>
        Update: never
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
      pois_in_bbox: {
        Args: {
          p_lng1: number
          p_lat1: number
          p_lng2: number
          p_lat2: number
          p_type?: PoiType
        }
        Returns: {
          id: string
          name: string
          type: PoiType
          lng: number
          lat: number
          canal_id: string | null
          mile_marker: number | null
          metadata: Json
          current_status: ServiceStatus | null
          report_count: number
          latest_report: string | null
        }[]
      }
      nearest_pois: {
        Args: {
          p_lng: number
          p_lat: number
          p_type?: PoiType
          p_limit?: number
        }
        Returns: {
          id: string
          name: string
          type: PoiType
          lng: number
          lat: number
          distance_m: number
          current_status: ServiceStatus | null
        }[]
      }
      confirm_report: {
        Args: { p_report_id: string }
        Returns: void
      }
      get_poi_status: {
        Args: { p_poi_id: string }
        Returns: { status: ServiceStatus; report_count: number; latest: string }[]
      }
      update_boat_location: {
        Args: {
          p_lat: number
          p_lng: number
          p_heading?: number
          p_accuracy?: number
        }
        Returns: void
      }
    }
    Enums: {
      poi_type: PoiType
      service_status: ServiceStatus
      boat_type: BoatType
      friendship_status: FriendshipStatus
      stoppage_type: StoppageType
      route_pace: RoutePace
      post_type: PostType
      post_visibility: PostVisibility
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type POI = Database['public']['Tables']['pois']['Row']
export type Canal = Database['public']['Tables']['canals']['Row']
export type Lock = Database['public']['Tables']['locks']['Row']
export type Stoppage = Database['public']['Tables']['stoppages']['Row']
export type StatusReport = Database['public']['Tables']['status_reports']['Row']
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

export type POIWithStatus = {
  id: string
  name: string
  type: PoiType
  lng: number
  lat: number
  canal_id: string | null
  mile_marker: number | null
  metadata: Json
  current_status: ServiceStatus | null
  report_count: number
  latest_report: string | null
}

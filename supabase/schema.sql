-- CrewSync Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Companies table
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  geofence_radius int default 100, -- meters
  noshow_alert_minutes int default 15,
  stripe_customer_id text,
  subscription_status text default 'trial',
  subscription_tier text, -- starter, professional, growth
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Sites table
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  address text not null,
  latitude decimal,
  longitude decimal,
  client_name text,
  client_email text,
  client_phone text,
  budget_hours decimal, -- target hours per cleaning
  service_frequency text, -- daily, weekly, biweekly, monthly
  notes text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Site checklists table
create table if not exists site_checklists (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  task text not null,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

-- Crew members table
create table if not exists crew_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  user_id uuid references auth.users, -- if they have app login
  name text not null,
  phone text,
  email text,
  language text default 'en', -- en, es, pt, zh
  hourly_rate decimal,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Schedules table
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  site_id uuid references sites(id) on delete cascade,
  crew_member_id uuid references crew_members(id) on delete set null,
  scheduled_date date not null,
  start_time time not null,
  end_time time not null,
  is_recurring boolean default false,
  recurrence_rule text, -- RRULE format
  status text default 'scheduled', -- scheduled, completed, missed, cancelled
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Time entries table
create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  schedule_id uuid references schedules(id) on delete set null,
  crew_member_id uuid references crew_members(id) on delete set null,
  site_id uuid references sites(id) on delete set null,
  clock_in timestamp with time zone,
  clock_in_latitude decimal,
  clock_in_longitude decimal,
  clock_in_verified boolean, -- within geofence?
  clock_out timestamp with time zone,
  clock_out_latitude decimal,
  clock_out_longitude decimal,
  clock_out_verified boolean,
  total_hours decimal,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Checklist completions table
create table if not exists checklist_completions (
  id uuid primary key default gen_random_uuid(),
  time_entry_id uuid references time_entries(id) on delete cascade,
  checklist_item_id uuid references site_checklists(id) on delete cascade,
  completed_at timestamp with time zone,
  photo_url text,
  created_at timestamp with time zone default now()
);

-- Alerts table
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  type text, -- no_show, late_arrival, off_site_clockin
  schedule_id uuid references schedules(id) on delete set null,
  crew_member_id uuid references crew_members(id) on delete set null,
  site_id uuid references sites(id) on delete set null,
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Inspection reports table
create table if not exists inspection_reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  time_entry_id uuid references time_entries(id) on delete set null,
  rating int check (rating >= 1 and rating <= 5),
  notes text,
  photos text[], -- array of URLs
  created_at timestamp with time zone default now()
);

-- Client portal access table
create table if not exists client_portal_access (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  access_token text unique not null,
  client_email text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

-- Messages table (for client portal)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  site_id uuid references sites(id) on delete cascade,
  sender_type text not null, -- 'client' or 'manager'
  sender_name text,
  sender_email text,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index if not exists idx_companies_user_id on companies(user_id);
create index if not exists idx_sites_company_id on sites(company_id);
create index if not exists idx_crew_members_company_id on crew_members(company_id);
create index if not exists idx_schedules_company_id on schedules(company_id);
create index if not exists idx_schedules_date on schedules(scheduled_date);
create index if not exists idx_schedules_crew_member on schedules(crew_member_id);
create index if not exists idx_time_entries_company_id on time_entries(company_id);
create index if not exists idx_time_entries_crew_member on time_entries(crew_member_id);
create index if not exists idx_time_entries_clock_in on time_entries(clock_in);
create index if not exists idx_alerts_company_id on alerts(company_id);
create index if not exists idx_alerts_is_read on alerts(is_read);

-- Row Level Security Policies

-- Enable RLS on all tables
alter table companies enable row level security;
alter table sites enable row level security;
alter table site_checklists enable row level security;
alter table crew_members enable row level security;
alter table schedules enable row level security;
alter table time_entries enable row level security;
alter table checklist_completions enable row level security;
alter table alerts enable row level security;
alter table inspection_reports enable row level security;
alter table client_portal_access enable row level security;
alter table messages enable row level security;

-- Companies policies
create policy "Users can view their own company" on companies
  for select using (auth.uid() = user_id);

create policy "Users can update their own company" on companies
  for update using (auth.uid() = user_id);

create policy "Users can insert their own company" on companies
  for insert with check (auth.uid() = user_id);

-- Sites policies
create policy "Users can view sites in their company" on sites
  for select using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users can manage sites in their company" on sites
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

-- Crew members policies
create policy "Users can view crew in their company" on crew_members
  for select using (
    company_id in (select id from companies where user_id = auth.uid())
    or user_id = auth.uid()
  );

create policy "Users can manage crew in their company" on crew_members
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

-- Schedules policies
create policy "Users can view schedules in their company" on schedules
  for select using (
    company_id in (select id from companies where user_id = auth.uid())
    or crew_member_id in (select id from crew_members where user_id = auth.uid())
  );

create policy "Users can manage schedules in their company" on schedules
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

-- Time entries policies
create policy "Users can view time entries in their company" on time_entries
  for select using (
    company_id in (select id from companies where user_id = auth.uid())
    or crew_member_id in (select id from crew_members where user_id = auth.uid())
  );

create policy "Users can manage time entries" on time_entries
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
    or crew_member_id in (select id from crew_members where user_id = auth.uid())
  );

-- Alerts policies
create policy "Users can view alerts in their company" on alerts
  for select using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users can manage alerts in their company" on alerts
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

-- Functions

-- Function to calculate distance between two points (Haversine formula)
create or replace function calculate_distance(
  lat1 decimal,
  lon1 decimal,
  lat2 decimal,
  lon2 decimal
) returns decimal as $$
declare
  r decimal := 6371000; -- Earth's radius in meters
  dlat decimal;
  dlon decimal;
  a decimal;
  c decimal;
begin
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  return r * c;
end;
$$ language plpgsql;

-- Function to update timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_companies_updated_at before update on companies
  for each row execute function update_updated_at();

create trigger update_sites_updated_at before update on sites
  for each row execute function update_updated_at();

create trigger update_crew_members_updated_at before update on crew_members
  for each row execute function update_updated_at();

create trigger update_schedules_updated_at before update on schedules
  for each row execute function update_updated_at();

create trigger update_time_entries_updated_at before update on time_entries
  for each row execute function update_updated_at();

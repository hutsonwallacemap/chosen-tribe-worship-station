// Supabase & LocalStorage Database Handler
// Falls back to LocalStorage if Supabase credentials are not configured in index.html/admin.html

const DB_CONFIG = {
    url: window.SUPABASE_URL || "",
    anonKey: window.SUPABASE_ANON_KEY || ""
};

let supabaseClient = null;

// Initialize Supabase if config is provided
if (DB_CONFIG.url && DB_CONFIG.anonKey && typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(DB_CONFIG.url, DB_CONFIG.anonKey);
        console.log("Supabase database connected successfully.");
    } catch (e) {
        console.error("Failed to initialize Supabase:", e);
    }
} else {
    console.log("Supabase config not found. Running in LocalStorage preview mode.");
}

// Submit a new registration
async function dbSubmitRegistration(name, phone, address, interest) {
    const registrationData = {
        name: name,
        phone: phone,
        address: address,
        interest: interest,
        created_at: new Date().toISOString()
    };

    if (supabaseClient) {
        // Online Mode (Supabase)
        const { data, error } = await supabaseClient
            .from('registrations')
            .insert([registrationData]);
        
        if (error) throw error;
        return { success: true, mode: 'online', data };
    } else {
        // Offline Preview Mode (LocalStorage)
        return new Promise((resolve) => {
            setTimeout(() => {
                let localData = JSON.parse(localStorage.getItem('ct_registrations')) || [];
                localData.push(registrationData);
                localStorage.setItem('ct_registrations', JSON.stringify(localData));
                resolve({ success: true, mode: 'local', data: registrationData });
            }, 500); // Simulate network latency
        });
    }
}

// Fetch all registrations
async function dbFetchRegistrations() {
    if (supabaseClient) {
        // Online Mode (Supabase)
        const { data, error } = await supabaseClient
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } else {
        // Offline Preview Mode (LocalStorage)
        return new Promise((resolve) => {
            setTimeout(() => {
                let localData = JSON.parse(localStorage.getItem('ct_registrations')) || [];
                // Sort by date descending
                localData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                resolve(localData);
            }, 400);
        });
    }
}

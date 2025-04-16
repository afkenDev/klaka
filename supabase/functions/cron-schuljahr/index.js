import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Lade die Umgebungsvariablen korrekt
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Fehlende Umgebungsvariablen: SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
    try {
        const { error } = await supabase.rpc("erhoehe_klassenstufe");

        if (error) {
            console.error("Fehler beim RPC-Aufruf:", error);
            return new Response("Fehler", { status: 500 });
        }

        return new Response("Erfolgreich", { status: 200 });
    } catch (err) {
        console.error("Fehler beim Ausführen der Funktion:", err);
        return new Response("Fehler", { status: 500 });
    }
});

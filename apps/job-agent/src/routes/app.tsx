import { Field } from "#/components/Field";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { TabButton } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";
import { authClient } from "#/lib/auth-client";
import type { AppData, ExperienceEntry, GenerationRecord } from "#/lib/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, FileUp, LogOut, Plus, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app")({
  component: App
});

const tabs = ["profile", "materials", "instructions", "generate", "history"] as const;
type Tab = (typeof tabs)[number];

function App() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [data, setData] = useState<AppData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    const response = await fetch("/api/app-data");
    if (response.status === 401) {
      await navigate({ to: "/login" });
      return;
    }
    setData((await response.json()) as AppData);
  }

  async function save(partial: Partial<AppData>) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/app-data", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(partial)
    });
    setSaving(false);

    if (!response.ok) {
      setMessage("Could not save changes.");
      return;
    }

    setData((await response.json()) as AppData);
    setMessage("Saved.");
  }

  async function uploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");

    if (!(file instanceof File)) {
      setMessage("Choose a CV file before uploading.");
      return;
    }

    setSaving(true);
    const fileData = await fileToBase64(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        kind: String(form.get("kind") || "source_cv"),
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        size: file.size,
        data: fileData
      })
    });
    setSaving(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error || `File upload failed (${response.status}).`);
      return;
    }

    const body = (await response.json()) as { id: string };
    setMessage("File uploaded to R2. Parsing experience entries in the background.");
    await loadData();
    void fetch("/api/parse-cv", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ documentId: body.id })
    }).finally(loadData);
  }

  async function generate() {
    setGenerating(true);
    setMessage("");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobUrl, jobDescription })
    });
    setGenerating(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error || "Generation failed.");
      return;
    }

    setMessage("Generated CV and cover letter.");
    setJobUrl("");
    setJobDescription("");
    setTab("history");
    await loadData();
  }

  if (!data) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 text-slate-700">Loading workspace...</main>;
  }

  const latestGeneration = data.generations[0];

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc,#e0f2fe)] px-4 py-6 md:px-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">jobs.haffi.dev</p>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">Application agent</h1>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              await authClient.signOut();
              await navigate({ to: "/login" });
            }}
          >
            <LogOut size={16} /> Sign out
          </Button>
        </header>

        <div className="flex gap-2 overflow-x-auto rounded-full bg-white/70 p-2 shadow-sm">
          {tabs.map((item) => (
            <TabButton key={item} active={tab === item} onClick={() => setTab(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </TabButton>
          ))}
        </div>

        {message ? <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">{message}</p> : null}

        {tab === "profile" ? <ProfileSection data={data} setData={setData} save={save} saving={saving} /> : null}
        {tab === "materials" ? <MaterialsSection data={data} setData={setData} save={save} saving={saving} uploadFile={uploadFile} /> : null}
        {tab === "instructions" ? <InstructionsSection data={data} setData={setData} save={save} saving={saving} /> : null}
        {tab === "generate" ? (
          <GenerateSection
            jobUrl={jobUrl}
            setJobUrl={setJobUrl}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            generating={generating}
            generate={generate}
            latestGeneration={latestGeneration}
          />
        ) : null}
        {tab === "history" ? <HistorySection generations={data.generations} /> : null}
      </section>
    </main>
  );
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.slice(result.indexOf(",") + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function ProfileSection(props: { data: AppData; setData: (data: AppData) => void; save: (partial: Partial<AppData>) => Promise<void>; saving: boolean }) {
  const profile = props.data.profile;
  function update(key: keyof typeof profile, value: string) {
    props.setData({ ...props.data, profile: { ...profile, [key]: value } });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Basic context the agent can use in a cover letter or CV summary.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Full name"><Input value={profile.full_name} onChange={(event) => update("full_name", event.target.value)} /></Field>
        <Field label="Target roles" hint="The roles you want the agent to optimise towards, for example Backend Engineer, Full-stack Engineer, or Platform Engineer."><Input value={profile.target_roles} onChange={(event) => update("target_roles", event.target.value)} placeholder="Senior backend engineer, full-stack engineer" /></Field>
        <Field label="Location" hint="Where you want to work, for example London, Remote UK, Hybrid London, or Europe remote."><Input value={profile.location} onChange={(event) => update("location", event.target.value)} /></Field>
        <Field label="Work authorisation" hint="Anything employers should know, for example UK citizen, no sponsorship required, or Skilled Worker visa."><Input value={profile.work_authorisation} onChange={(event) => update("work_authorisation", event.target.value)} /></Field>
        <Field label="Links"><Textarea value={profile.links} onChange={(event) => update("links", event.target.value)} placeholder="LinkedIn, GitHub, portfolio" /></Field>
        <div className="md:col-span-2"><Button disabled={props.saving} onClick={() => props.save({ profile })}>{props.saving ? "Saving..." : "Save profile"}</Button></div>
      </CardContent>
    </Card>
  );
}

function MaterialsSection(props: { data: AppData; setData: (data: AppData) => void; save: (partial: Partial<AppData>) => Promise<void>; saving: boolean; uploadFile: (event: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  const sourceMaterial = props.data.sourceMaterial;
  const sourceCv = props.data.documents.find((document) => document.kind === "source_cv" && document.content_type === "application/pdf") || props.data.documents.find((document) => document.kind === "source_cv");
  function update(key: keyof typeof sourceMaterial, value: string) {
    props.setData({ ...props.data, sourceMaterial: { ...sourceMaterial, [key]: value } });
  }

  function updateExperience(id: string, patch: Partial<ExperienceEntry>) {
    props.setData({
      ...props.data,
      experienceEntries: props.data.experienceEntries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
    });
  }

  function addExperience() {
    props.setData({
      ...props.data,
      experienceEntries: [
        ...props.data.experienceEntries,
        {
          id: crypto.randomUUID(),
          title: "New experience entry",
          kind: "job",
          content: "",
          sort_order: props.data.experienceEntries.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  }

  function deleteExperience(id: string) {
    props.setData({ ...props.data, experienceEntries: props.data.experienceEntries.filter((entry) => entry.id !== id) });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
      <Card>
        <CardHeader>
          <CardTitle>Unchanged source material</CardTitle>
          <CardDescription>Your uploaded CV is shown unchanged. Experience entries below are editable source material for the agent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sourceCv?.content_type === "application/pdf" ? (
            <iframe title="Uploaded CV preview" src={`/api/document/${sourceCv.id}?disposition=inline`} className="h-[620px] w-full rounded-lg border border-slate-200 bg-slate-50" />
          ) : sourceCv ? (
            <a href={`/api/document/${sourceCv.id}`} className="block rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700 underline">Download uploaded CV: {sourceCv.filename}</a>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">Upload a PDF CV to preview it here.</div>
          )}
          <Field label="Extra notes"><Textarea value={sourceMaterial.extra_notes} onChange={(event) => update("extra_notes", event.target.value)} /></Field>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2" onClick={addExperience}><Plus size={16} /> Add experience</Button>
            <Button disabled={props.saving} onClick={() => props.save({ sourceMaterial, experienceEntries: props.data.experienceEntries })}>{props.saving ? "Saving..." : "Save materials"}</Button>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-950">Experience</h3>
            {props.data.experienceEntries.length ? props.data.experienceEntries.map((entry) => (
              <details key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer font-semibold text-slate-950">{entry.title || "Untitled entry"}</summary>
                <div className="mt-4 grid gap-3">
                  <Field label="Heading"><Input value={entry.title} onChange={(event) => updateExperience(entry.id, { title: event.target.value })} /></Field>
                  <Field label="Type"><Input value={entry.kind} onChange={(event) => updateExperience(entry.id, { kind: event.target.value })} placeholder="job, project, or other" /></Field>
                  <Field label="Rich text"><Textarea className="min-h-44" value={entry.content} onChange={(event) => updateExperience(entry.id, { content: event.target.value })} /></Field>
                  <Button variant="ghost" className="justify-self-start text-red-700" onClick={() => deleteExperience(entry.id)}>Delete entry</Button>
                </div>
              </details>
            )) : <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No experience entries yet. Upload a CV to parse entries or add one manually.</p>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Document storage</CardTitle>
          <CardDescription>Upload original CV files to R2 for reference and download.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="space-y-3" onSubmit={props.uploadFile}>
            <input type="hidden" name="kind" value="source_cv" />
            <Input type="file" name="file" required />
            <Button type="submit" variant="secondary" className="gap-2" disabled={props.saving}><FileUp size={16} /> Upload CV</Button>
          </form>
          <div className="space-y-2">
            {props.data.documents.map((document) => (
              <a key={document.id} href={`/api/document/${document.id}`} className="block rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50">
                <span className="font-semibold text-slate-950">{document.filename}</span>
                <span className="block text-slate-500">{document.kind} · {Math.ceil(document.size_bytes / 1024)} KB · {document.parse_status}</span>
                {document.parse_error ? <span className="block text-red-600">{document.parse_error}</span> : null}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InstructionsSection(props: { data: AppData; setData: (data: AppData) => void; save: (partial: Partial<AppData>) => Promise<void>; saving: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent instructions</CardTitle>
        <CardDescription>Optional. You can leave this blank and come back later to steer tone, emphasis, exclusions, formatting, or anything else needed to get the output closer to what you want.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea className="min-h-80" value={props.data.instructions} onChange={(event) => props.setData({ ...props.data, instructions: event.target.value })} />
        <Button disabled={props.saving} onClick={() => props.save({ instructions: props.data.instructions })}>{props.saving ? "Saving..." : "Save instructions"}</Button>
      </CardContent>
    </Card>
  );
}

function GenerateSection(props: {
  jobUrl: string;
  setJobUrl: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  generating: boolean;
  generate: () => Promise<void>;
  latestGeneration?: GenerationRecord;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Generate documents</CardTitle>
          <CardDescription>Paste a job link or description. The CV will be conservative, not rewritten from scratch.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Job description URL"><Input value={props.jobUrl} onChange={(event) => props.setJobUrl(event.target.value)} placeholder="https://..." /></Field>
          <Field label="Pasted job description" hint="Optional if the URL is fetchable. Recommended for LinkedIn or sites that block bots.">
            <Textarea className="min-h-72" value={props.jobDescription} onChange={(event) => props.setJobDescription(event.target.value)} />
          </Field>
          <Button className="gap-2" variant="secondary" disabled={props.generating} onClick={props.generate}><Wand2 size={16} /> {props.generating ? "Generating..." : "Generate CV and cover letter"}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latest output</CardTitle>
          <CardDescription>Downloads are stored in R2 as Markdown files.</CardDescription>
        </CardHeader>
        <CardContent>
          {props.latestGeneration ? <Generation generation={props.latestGeneration} /> : <p className="text-sm text-slate-500">No generations yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function HistorySection({ generations }: { generations: Array<GenerationRecord> }) {
  return (
    <div className="space-y-4">
      {generations.length ? generations.map((generation) => <Generation key={generation.id} generation={generation} />) : <Card><CardContent className="p-6 text-sm text-slate-500">No generated applications yet.</CardContent></Card>}
    </div>
  );
}

function Generation({ generation }: { generation: GenerationRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{generation.job_url || "Pasted job description"}</CardTitle>
        <CardDescription>{generation.created_at} · {generation.model}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <Output title="Tailored CV" text={generation.generated_cv} documentId={generation.cv_document_id} />
        <Output title="Cover letter" text={generation.generated_cover_letter} documentId={generation.cover_letter_document_id} />
      </CardContent>
    </Card>
  );
}

function Output({ title, text, documentId }: { title: string; text: string; documentId: string | null }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        {documentId ? <a href={`/api/document/${documentId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 underline"><Download size={14} /> Download</a> : null}
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">{text}</pre>
    </section>
  );
}

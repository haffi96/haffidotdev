import { Field } from "#/components/Field";
import { ThemeToggle } from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { TabButton } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";
import { authClient } from "#/lib/auth-client";
import type { AppData, ExperienceEntry, GenerationComment, GenerationRecord } from "#/lib/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Copy, Download, FileDown, FileUp, LogOut, MessageCircle, Plus, RefreshCw, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: isTab(search.tab) ? search.tab : "profile"
  }),
  component: App
});

const tabs = ["profile", "materials", "instructions", "generate", "history"] as const;
type Tab = (typeof tabs)[number];

function App() {
  const navigate = useNavigate();
  const { tab } = Route.useSearch();
  const [data, setData] = useState<AppData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [revising, setRevising] = useState(false);

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
    void parseDocument(body.id);
  }

  async function parseDocument(documentId: string) {
    setMessage("Parsing experience entries from the uploaded CV.");
    try {
      const response = await fetch("/api/parse-cv", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ documentId })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setMessage(body?.error || `CV parsing failed (${response.status}).`);
      } else {
        setMessage("Parsed experience entries from the uploaded CV.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CV parsing failed.");
    } finally {
      await loadData();
    }
  }

  function selectTab(nextTab: Tab) {
    void navigate({ to: "/app", search: { tab: nextTab }, replace: true });
  }

  async function generate() {
    if (!companyName.trim()) {
      setMessage("Add the company name before generating.");
      return;
    }

    setGenerating(true);
    setMessage("");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyName, jobUrl, jobDescription })
    });
    setGenerating(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error || "Generation failed.");
      return;
    }

    setMessage("Generated CV and cover letter.");
    setCompanyName("");
    setJobUrl("");
    setJobDescription("");
    selectTab("history");
    await loadData();
  }

  async function addComment(input: { generationId: string; documentKind: "cv" | "cover_letter"; anchorText: string; commentText: string }) {
    setMessage("");
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error || "Could not save comment.");
      return;
    }

    const body = (await response.json()) as { data: AppData };
    setData(body.data);
    setMessage("Comment added.");
  }

  async function requestRevision(generationId: string) {
    setRevising(true);
    setMessage("");
    const response = await fetch("/api/revise", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ generationId })
    });
    setRevising(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error || "Revision failed.");
      return;
    }

    setMessage("Created a new revision and resolved the comments.");
    await loadData();
  }

  if (!data) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300">Loading workspace...</main>;
  }

  const latestGeneration = data.generations[0];

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc,#e0f2fe)] px-4 py-6 dark:bg-[linear-gradient(135deg,#020617,#0f172a)] md:px-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">jobs.haffi.dev</p>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-slate-100 md:text-5xl">Application agent</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <ThemeToggle />
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
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto rounded-full bg-white/70 p-2 shadow-sm dark:bg-slate-900/70">
          {tabs.map((item) => (
            <TabButton key={item} active={tab === item} onClick={() => selectTab(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </TabButton>
          ))}
        </div>

        {message ? <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">{message}</p> : null}

        {tab === "profile" ? <ProfileSection data={data} setData={setData} save={save} saving={saving} /> : null}
        {tab === "materials" ? <MaterialsSection data={data} setData={setData} save={save} saving={saving} uploadFile={uploadFile} parseDocument={parseDocument} /> : null}
        {tab === "instructions" ? <InstructionsSection data={data} setData={setData} save={save} saving={saving} /> : null}
        {tab === "generate" ? (
          <GenerateSection
            companyName={companyName}
            setCompanyName={setCompanyName}
            jobUrl={jobUrl}
            setJobUrl={setJobUrl}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            generating={generating}
            generate={generate}
            latestGeneration={latestGeneration}
            addComment={addComment}
            requestRevision={requestRevision}
            revising={revising}
          />
        ) : null}
        {tab === "history" ? <HistorySection generations={data.generations} addComment={addComment} requestRevision={requestRevision} revising={revising} /> : null}
      </section>
    </main>
  );
}

function isTab(value: unknown): value is Tab {
  return typeof value === "string" && tabs.includes(value as Tab);
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

function MaterialsSection(props: { data: AppData; setData: (data: AppData) => void; save: (partial: Partial<AppData>) => Promise<void>; saving: boolean; uploadFile: (event: React.FormEvent<HTMLFormElement>) => Promise<void>; parseDocument: (documentId: string) => Promise<void> }) {
  const sourceMaterial = props.data.sourceMaterial;
  const sourceCv = props.data.documents.find((document) => document.kind === "source_cv" && document.content_type === "application/pdf") || props.data.documents.find((document) => document.kind === "source_cv");
  const uploadedDocuments = props.data.documents.filter((document) => document.kind === "source_cv");
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
            <iframe title="Uploaded CV preview" src={`/api/document/${sourceCv.id}?disposition=inline`} className="h-[620px] w-full rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
          ) : sourceCv ? (
            <a href={`/api/document/${sourceCv.id}`} className="block rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700 underline dark:border-slate-800 dark:text-slate-300">Download uploaded CV: {sourceCv.filename}</a>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Upload a PDF CV to preview it here.</div>
          )}
          <Field label="Extra notes"><Textarea value={sourceMaterial.extra_notes} onChange={(event) => update("extra_notes", event.target.value)} /></Field>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2" onClick={addExperience}><Plus size={16} /> Add experience</Button>
            <Button disabled={props.saving} onClick={() => props.save({ sourceMaterial, experienceEntries: props.data.experienceEntries })}>{props.saving ? "Saving..." : "Save materials"}</Button>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Experience</h3>
            {props.data.experienceEntries.length ? props.data.experienceEntries.map((entry) => (
              <details key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950" open>
                <summary className="cursor-pointer font-semibold text-slate-950 dark:text-slate-100">{entry.title || "Untitled entry"}</summary>
                <div className="mt-4 grid gap-3">
                  <Field label="Heading"><Input value={entry.title} onChange={(event) => updateExperience(entry.id, { title: event.target.value })} /></Field>
                  <Field label="Type"><Input value={entry.kind} onChange={(event) => updateExperience(entry.id, { kind: event.target.value })} placeholder="job, project, or other" /></Field>
                  <Field label="Rich text"><Textarea className="min-h-44" value={entry.content} onChange={(event) => updateExperience(entry.id, { content: event.target.value })} /></Field>
                  <Button variant="ghost" className="justify-self-start text-red-700 dark:text-red-300" onClick={() => deleteExperience(entry.id)}>Delete entry</Button>
                </div>
              </details>
            )) : <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">No experience entries yet. Upload a CV to parse entries or add one manually.</p>}
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
            {uploadedDocuments.map((document) => (
              <div key={document.id} className="rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950">
                <a href={`/api/document/${document.id}`} className="block">
                  <span className="font-semibold text-slate-950 dark:text-slate-100">{document.filename}</span>
                  <span className="block text-slate-500 dark:text-slate-400">{document.kind} · {Math.ceil(document.size_bytes / 1024)} KB · {document.parse_status}</span>
                  {document.parse_error ? <span className="block text-red-600 dark:text-red-300">{document.parse_error}</span> : null}
                </a>
                {document.kind === "source_cv" && document.parse_status !== "parsed" ? (
                  <Button type="button" variant="outline" className="mt-3" onClick={() => props.parseDocument(document.id)}>{document.parse_status === "parsing" ? "Restart parse" : "Retry parse"}</Button>
                ) : null}
              </div>
            ))}
            {!uploadedDocuments.length ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">No uploaded documents yet.</p> : null}
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
  companyName: string;
  setCompanyName: (value: string) => void;
  jobUrl: string;
  setJobUrl: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  generating: boolean;
  generate: () => Promise<void>;
  latestGeneration?: GenerationRecord;
  addComment: AddComment;
  requestRevision: (generationId: string) => Promise<void>;
  revising: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Generate documents</CardTitle>
          <CardDescription>Paste a job link or description. The CV will be conservative, not rewritten from scratch.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Company name"><Input value={props.companyName} onChange={(event) => props.setCompanyName(event.target.value)} placeholder="Acme Corp" required /></Field>
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
          {props.latestGeneration ? <Generation generation={props.latestGeneration} addComment={props.addComment} requestRevision={props.requestRevision} revising={props.revising} /> : <p className="text-sm text-slate-500 dark:text-slate-400">No generations yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function HistorySection({ generations, addComment, requestRevision, revising }: { generations: Array<GenerationRecord>; addComment: AddComment; requestRevision: (generationId: string) => Promise<void>; revising: boolean }) {
  const groups = generations.reduce<Record<string, Array<GenerationRecord>>>((result, generation) => {
    const session = generation.session_id || generation.id;
    result[session] = [...(result[session] || []), generation].sort((a, b) => a.revision_number - b.revision_number);
    return result;
  }, {});
  const sessions = Object.keys(groups).sort((a, b) => (groups[b]?.at(-1)?.created_at || "").localeCompare(groups[a]?.at(-1)?.created_at || ""));
  const [selectedSession, setSelectedSession] = useState(sessions[0] || "");
  const sessionGenerations = groups[selectedSession] || groups[sessions[0] || ""] || [];
  const [selectedGenerationId, setSelectedGenerationId] = useState(sessionGenerations.at(-1)?.id || "");
  const selectedGeneration = sessionGenerations.find((generation) => generation.id === selectedGenerationId) || sessionGenerations.at(-1);

  useEffect(() => {
    if (!sessions.length) return;
    if (!groups[selectedSession]) setSelectedSession(sessions[0] || "");
  }, [sessions.join("|"), selectedSession]);

  useEffect(() => {
    if (!sessionGenerations.length) return;
    if (!sessionGenerations.some((generation) => generation.id === selectedGenerationId)) setSelectedGenerationId(sessionGenerations.at(-1)?.id || "");
  }, [sessionGenerations, selectedGenerationId]);

  if (!generations.length) {
    return <Card><CardContent className="p-6 text-sm text-slate-500 dark:text-slate-400">No generated applications yet.</CardContent></Card>;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Select a job application to browse revisions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessions.map((session) => {
            const latest = groups[session]?.at(-1);
            const openComments = groups[session]?.reduce((total, generation) => total + generation.comments.filter((comment) => comment.status === "open").length, 0) || 0;
            return (
              <button
                key={session}
                type="button"
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold ${session === selectedSession ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                onClick={() => {
                  setSelectedSession(session);
                  setSelectedGenerationId(groups[session]?.at(-1)?.id || "");
                }}
              >
                <span className="block">{latest?.company_name || "Uncategorized"}</span>
                <span className={session === selectedSession ? "text-slate-300 dark:text-slate-600" : "text-slate-400"}>{groups[session]?.length || 0} revision{groups[session]?.length === 1 ? "" : "s"}{openComments ? ` · ${openComments} open` : ""}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto rounded-full bg-white/70 p-2 shadow-sm dark:bg-slate-900/70">
          {sessionGenerations.map((generation) => (
            <TabButton key={generation.id} active={generation.id === selectedGeneration?.id} onClick={() => setSelectedGenerationId(generation.id)}>
              {generationLabel(generation)}
            </TabButton>
          ))}
        </div>
        {selectedGeneration ? <Generation generation={selectedGeneration} addComment={addComment} requestRevision={requestRevision} revising={revising} /> : null}
      </div>
    </div>
  );
}

function generationLabel(generation: GenerationRecord) {
  const openComments = generation.comments.filter((comment) => comment.status === "open").length;
  return `v${generation.revision_number || 1}${openComments ? ` · ${openComments} open` : ""}`;
}

type AddComment = (input: { generationId: string; documentKind: "cv" | "cover_letter"; anchorText: string; commentText: string }) => Promise<void>;

function Generation({ generation, addComment, requestRevision, revising }: { generation: GenerationRecord; addComment: AddComment; requestRevision: (generationId: string) => Promise<void>; revising: boolean }) {
  const openComments = generation.comments.filter((comment) => comment.status === "open");
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <CardTitle className="text-lg">{generation.company_name || "Uncategorized"} · v{generation.revision_number || 1}</CardTitle>
            {generation.job_url ? <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{generation.job_url}</p> : null}
            <CardDescription>{generation.created_at} · {generation.model}</CardDescription>
          </div>
          <Button type="button" className="gap-2" variant="secondary" disabled={revising || !openComments.length} onClick={() => requestRevision(generation.id)}>
            <RefreshCw size={16} /> {revising ? "Revising..." : `Request revision${openComments.length ? ` (${openComments.length})` : ""}`}
          </Button>
        </div>
        {!openComments.length ? <p className="text-sm text-slate-500 dark:text-slate-400">Add comments to specific blocks, then request a new revision.</p> : null}
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <Output title="Tailored CV" documentKind="cv" generationId={generation.id} text={generation.generated_cv} documentId={generation.cv_document_id} companyName={generation.company_name} createdAt={generation.created_at} comments={generation.comments.filter((comment) => comment.document_kind === "cv")} addComment={addComment} />
        <Output title="Cover letter" documentKind="cover_letter" generationId={generation.id} text={generation.generated_cover_letter} documentId={generation.cover_letter_document_id} companyName={generation.company_name} createdAt={generation.created_at} comments={generation.comments.filter((comment) => comment.document_kind === "cover_letter")} addComment={addComment} />
      </CardContent>
    </Card>
  );
}

type OutputFormat = "markdown" | "docx" | "pdf" | "text";
type OutputAction = "copy" | "export";
type OutputFile = { filename: string; label: string; type: string; blob: Blob };

const outputFormats: Array<{ value: OutputFormat; label: string; extension: string; type: string }> = [
  { value: "markdown", label: "Markdown", extension: "md", type: "text/markdown;charset=utf-8" },
  { value: "docx", label: "DOCX", extension: "docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { value: "pdf", label: "PDF", extension: "pdf", type: "application/pdf" },
  { value: "text", label: "Raw text", extension: "txt", type: "text/plain;charset=utf-8" }
];
const copyFormats = outputFormats.filter((format) => format.value === "markdown" || format.value === "text");

function Output({ title, documentKind, generationId, text, documentId, companyName, createdAt, comments, addComment }: { title: string; documentKind: "cv" | "cover_letter"; generationId: string; text: string; documentId: string | null; companyName?: string; createdAt?: string; comments: Array<GenerationComment>; addComment: AddComment }) {
  const [action, setAction] = useState<OutputAction | null>(null);
  const [status, setStatus] = useState("");
  const [commentAnchor, setCommentAnchor] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!status.startsWith("Copied")) return;
    const timeout = window.setTimeout(() => setStatus(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleFormat(format: OutputFormat) {
    try {
      const file = await outputFile(title, text, format, companyName, createdAt);

      if (action === "export") {
        downloadBlob(file.blob, file.filename);
        setStatus(`Downloaded ${file.label}.`);
      } else {
        await copyOutput(file, format);
        setStatus(`Copied ${file.label}.`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not complete output action.");
    } finally {
      setAction(null);
    }
  }

  async function submitComment() {
    await addComment({ generationId, documentKind, anchorText: commentAnchor, commentText });
    setCommentAnchor("");
    setCommentText("");
  }

  const blocks = markdownBlocks(text);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" className="gap-1" onClick={() => setAction("copy")}><Copy size={14} /> Copy as</Button>
          <Button type="button" variant="outline" className="gap-1" onClick={() => setAction("export")}><FileDown size={14} /> Export as</Button>
          {documentId ? <a href={`/api/document/${documentId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 underline dark:text-slate-300"><Download size={14} /> Stored MD</a> : null}
        </div>
      </div>
      {status ? <p className={`rounded-full px-3 py-1 text-xs font-medium ${status.startsWith("Copied") ? "inline-block bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" : "text-slate-500 dark:text-slate-400"}`}>{status}</p> : null}
      <div className="max-h-[42rem] space-y-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
        {blocks.map((block, index) => {
          const blockComments = comments.filter((comment) => comment.anchor_text === block.text);
          return (
            <div key={`${block.text}-${index}`} className="rounded-md border border-transparent p-2 hover:border-slate-700 hover:bg-slate-900">
              <pre className="whitespace-pre-wrap font-mono">{block.text}</pre>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" className="h-7 gap-1 border-slate-600 bg-slate-900 px-2 text-xs text-slate-100 hover:bg-slate-800" onClick={() => setCommentAnchor(block.text)}><MessageCircle size={13} /> Comment</Button>
                {blockComments.map((comment) => (
                  <span key={comment.id} className={`rounded-full px-2 py-1 text-[0.7rem] font-semibold ${comment.status === "open" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{comment.status}: {comment.comment_text}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {commentAnchor ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">Comment on selected block</p>
          <blockquote className="mb-3 max-h-28 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300">{commentAnchor}</blockquote>
          <Textarea className="min-h-28" value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Tell the AI what to change here..." />
          <div className="mt-3 flex gap-2">
            <Button type="button" disabled={!commentText.trim()} onClick={submitComment}>Save comment</Button>
            <Button type="button" variant="ghost" onClick={() => { setCommentAnchor(""); setCommentText(""); }}>Cancel</Button>
          </div>
        </div>
      ) : null}
      {action ? <OutputFormatModal action={action} onClose={() => setAction(null)} onSelect={handleFormat} /> : null}
    </section>
  );
}

function markdownBlocks(value: string) {
  return value
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

function OutputFormatModal(props: { action: OutputAction; onClose: () => void; onSelect: (format: OutputFormat) => void }) {
  const formats = props.action === "copy" ? copyFormats : outputFormats;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4" role="dialog" aria-modal="true" aria-label={props.action === "copy" ? "Copy as" : "Export as"}>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-slate-100">{props.action === "copy" ? "Copy as" : "Export as"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose the format for this output.</p>
          </div>
          <Button type="button" variant="ghost" onClick={props.onClose}>Close</Button>
        </div>
        <div className="grid gap-2">
          {formats.map((format) => (
            <Button key={format.value} type="button" variant="outline" className="justify-start" onClick={() => props.onSelect(format.value)}>{format.label}</Button>
          ))}
        </div>
      </div>
    </div>
  );
}

async function outputFile(title: string, markdown: string, format: OutputFormat, companyName?: string, createdAt?: string): Promise<OutputFile> {
  const details = outputFormats.find((item) => item.value === format) || outputFormats[0]!;
  const datePart = createdAt ? createdAt.split(" ")[0] : "";
  const companyPart = companyName ? slugifyFilename(companyName) : "";
  const nameParts = [companyPart, datePart, slugifyFilename(title)].filter(Boolean);
  const filename = `${nameParts.join("-")}.${details.extension}`;
  const body = format === "text" ? markdownToText(markdown) : markdown;

  if (format === "docx") return { ...details, filename, blob: await createDocx(title, body) };
  if (format === "pdf") return { ...details, filename, blob: createPdf(title, body) };
  return { ...details, filename, blob: new Blob([body], { type: details.type }) };
}

async function copyOutput(file: OutputFile, format: OutputFormat) {
  if (format === "markdown" || format === "text") {
    await navigator.clipboard.writeText(await file.blob.text());
    return;
  }

  throw new Error(`${file.label} is only available from Export as.`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function markdownToText(value: string) {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*+]\s+/gm, "- ")
    .trim();
}

function slugifyFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "output";
}

async function createDocx(title: string, text: string) {
  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
          ...text.split("\n").map((line) => new Paragraph({ children: [new TextRun(line)] }))
        ]
      }
    ]
  });
  return Packer.toBlob(document);
}

function createPdf(title: string, text: string) {
  const lines = wrapText([title, "", ...text.split("\n")].join("\n"), 86);
  const content = ["BT", "/F1 10 Tf", "50 790 Td", "14 TL", ...lines.map((line, index) => `${index ? "T*" : ""} (${escapePdf(line)}) Tj`), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function wrapText(value: string, width: number) {
  return value.split("\n").flatMap((line) => {
    const chunks = [];
    for (let index = 0; index < line.length || index === 0; index += width) chunks.push(line.slice(index, index + width));
    return chunks;
  });
}

function escapePdf(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

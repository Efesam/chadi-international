import ResourceManager from "../../components/admin/ResourceManager";
import { faqsApi } from "../../services/api";

const fields = [
  { name: "question", label: "Question", required: true, fullWidth: true },
  { name: "answer", label: "Answer", type: "textarea", required: true, fullWidth: true },
];

const columns = [{ key: "question", label: "Question" }];

function ManageFaqs() {
  return (
    <ResourceManager
      title="FAQ"
      description="Manage the questions and answers shown on the public FAQ page."
      api={faqsApi}
      fields={fields}
      columns={columns}
      emptyMessage="No FAQs yet. Add your first question."
    />
  );
}

export default ManageFaqs;

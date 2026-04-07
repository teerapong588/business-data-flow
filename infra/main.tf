provider "google" {
  project     = "bcap-434608"
  region      = "asia-southeast1"
  credentials = file("../service-account.json")
}

resource "google_cloud_run_service" "business_data_flow" {
  name     = "business-data-flow"
  location = "asia-southeast1"

  template {
    metadata {
      annotations = {
        "run.googleapis.com/revision-history-limit" = "3"
        "autoscaling.knative.dev/minScale"          = "0"
        "autoscaling.knative.dev/maxScale"          = "2"
      }
    }
    spec {
      containers {
        image = "asia-southeast1-docker.pkg.dev/bcap-434608/business-data-flow/prod:latest"

        resources {
          limits = {
            memory = "512Mi"
            cpu    = "1.0"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

# Allow all users to invoke the Cloud Run service
resource "google_cloud_run_service_iam_member" "invoker" {
  service  = google_cloud_run_service.business_data_flow.name
  location = google_cloud_run_service.business_data_flow.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Grant artifact registry reader permission to the service account
resource "google_project_iam_member" "artifact_registry_permissions" {
  project = "bcap-434608"
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:bcap-434608@appspot.gserviceaccount.com"
}

# Ensure the user or account running Terraform has permission to act as the service account
resource "google_project_iam_member" "service_account_user" {
  project = "bcap-434608"
  role    = "roles/iam.serviceAccountUser"
  member  = "user:teerapong.intoom@gmail.com"
}

output "cloud_run_url" {
  value = google_cloud_run_service.business_data_flow.status[0].url
}

provider "google" {
  project = "bcap-434608"
  region  = "asia-southeast1"
}

resource "google_artifact_registry_repository" "business_data_flow" {
  location      = "asia-southeast1"
  repository_id = "business-data-flow"
  description   = "Docker images for business-data-flow"
  format        = "DOCKER"
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


output "cloud_run_url" {
  value = google_cloud_run_service.business_data_flow.status[0].url
}

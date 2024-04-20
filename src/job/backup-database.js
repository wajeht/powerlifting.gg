export async function backupDatabase(job) {
	for (let i = 0; i < 100; i++) {
		job.updateProgress(i + 1);
	}
	return { jobId: `This is the return value of job (${job.id})` };
}

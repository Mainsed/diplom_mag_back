import { Controller, Get } from '@nestjs/common';
import { ReportService } from '@modules/reports/reports.service';

/**
 * Controler to execute reportorization
 * @param {ReportService} reportService - report service instance
 */
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport() {
    return this.reportService.getReport();
  }
}
